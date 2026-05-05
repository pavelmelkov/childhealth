import { eq } from 'drizzle-orm';
import webPush, { type PushSubscription as WebPushSubscription } from 'web-push';

import { db } from '@/db';
import { pushSubscriptions, users } from '@/db/schema';

type BookingNotificationInput = {
  startsAt: Date;
  endsAt: Date;
  parentName: string;
  parentPhone?: string | null;
  childName: string;
};

let webPushIsConfigured = false;

function configureWebPush() {
  if (webPushIsConfigured) {
    return true;
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:admin@example.com';

  if (!publicKey || !privateKey) {
    return false;
  }

  webPush.setVapidDetails(subject, publicKey, privateKey);
  webPushIsConfigured = true;

  return true;
}

function formatBookingDate(startsAt: Date, endsAt: Date) {
  const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Moscow',
  });
  const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });

  return `${dateFormatter.format(startsAt)}, ${timeFormatter.format(startsAt)} - ${timeFormatter.format(endsAt)}`;
}

function isExpiredSubscriptionError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    (error.statusCode === 404 || error.statusCode === 410)
  );
}

export async function notifyAdminsAboutBooking(input: BookingNotificationInput) {
  if (!configureWebPush()) {
    return;
  }

  const subscriptions = await db
    .select({
      id: pushSubscriptions.id,
      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,
    })
    .from(pushSubscriptions)
    .innerJoin(users, eq(pushSubscriptions.userId, users.id))
    .where(eq(users.role, 'admin'));

  if (subscriptions.length === 0) {
    return;
  }

  const payload = JSON.stringify({
    title: 'Новая запись',
    body: [
      formatBookingDate(input.startsAt, input.endsAt),
      `Ребенок: ${input.childName}`,
      `Родитель: ${input.parentName}`,
      input.parentPhone ? `Телефон: ${input.parentPhone}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    url: '/admin/bookings',
  });

  await Promise.all(
    subscriptions.map(async (subscription) => {
      const webPushSubscription: WebPushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      try {
        await webPush.sendNotification(webPushSubscription, payload);
      } catch (error) {
        if (isExpiredSubscriptionError(error)) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, subscription.id));
        }
      }
    }),
  );
}
