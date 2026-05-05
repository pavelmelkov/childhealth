'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';

const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function saveAdminPushSubscription(rawSubscription: unknown) {
  const session = await requireAdmin();
  const parsed = pushSubscriptionSchema.safeParse(rawSubscription);

  if (!parsed.success) {
    return { ok: false, message: 'Не удалось прочитать push-подписку.' };
  }

  const expirationTime = parsed.data.expirationTime
    ? new Date(parsed.data.expirationTime)
    : null;

  await db
    .insert(pushSubscriptions)
    .values({
      userId: session.user.id,
      endpoint: parsed.data.endpoint,
      p256dh: parsed.data.keys.p256dh,
      auth: parsed.data.keys.auth,
      expirationTime,
      userAgent: null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId: session.user.id,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
        expirationTime,
        updatedAt: new Date(),
      },
    });

  return { ok: true, message: 'Уведомления включены на этом устройстве.' };
}

export async function removeAdminPushSubscription(endpoint: string) {
  await requireAdmin();

  if (!endpoint) {
    return { ok: false, message: 'Подписка не найдена.' };
  }

  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));

  return { ok: true, message: 'Уведомления выключены на этом устройстве.' };
}
