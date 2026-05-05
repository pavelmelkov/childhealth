'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireSession } from '@/auth/guards';
import { db } from '@/db';
import { bookings, calendarSlots, children, users } from '@/db/schema';
import { notifyAdminsAboutBooking } from '@/lib/push';
import { getAvailableScheduleSlots } from '@/lib/schedule';

const bookSlotSchema = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  childId: z.string().uuid(),
});

export async function bookCalendarSlot(formData: FormData) {
  const session = await requireSession();

  if (session.user.role !== 'parent') {
    redirect('/admin');
  }

  const parsed = bookSlotSchema.safeParse({
    startsAt: formData.get('startsAt'),
    endsAt: formData.get('endsAt'),
    childId: formData.get('childId'),
  });

  if (!parsed.success) {
    redirect('/cabinet?error=invalid');
  }

  const child = await db.query.children.findFirst({
    where: and(eq(children.id, parsed.data.childId), eq(children.parentId, session.user.id)),
  });

  if (!child) {
    redirect('/cabinet?error=child');
  }

  const availableSlots = await getAvailableScheduleSlots();
  const requestedStart = new Date(parsed.data.startsAt);
  const requestedEnd = new Date(parsed.data.endsAt);
  const slotIsAvailable = availableSlots.some(
    (slot) =>
      slot.startsAt.getTime() === requestedStart.getTime() &&
      slot.endsAt.getTime() === requestedEnd.getTime(),
  );

  if (!slotIsAvailable) {
    redirect('/cabinet?error=slot');
  }

  const parent = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  await db.transaction(async (tx) => {
    const [slot] = await tx
      .insert(calendarSlots)
      .values({
        startsAt: requestedStart,
        endsAt: requestedEnd,
        status: 'booked',
      })
      .returning({ id: calendarSlots.id });

    await tx.insert(bookings).values({
      slotId: slot.id,
      parentId: session.user.id,
      childId: child.id,
      status: 'pending',
    });
  });

  try {
    await notifyAdminsAboutBooking({
      startsAt: requestedStart,
      endsAt: requestedEnd,
      parentName: parent?.fullName ?? session.user.name ?? 'Родитель',
      parentPhone: parent?.phone,
      childName: child.name,
    });
  } catch {
    // Booking is more important than a delivery failure in the browser push channel.
  }

  redirect('/cabinet?booked=1');
}
