'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { bookings, calendarSlots } from '@/db/schema';

const updateBookingSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

export async function updateBookingStatus(formData: FormData) {
  await requireAdmin();

  const parsed = updateBookingSchema.safeParse({
    bookingId: formData.get('bookingId'),
    status: formData.get('status'),
  });

  if (!parsed.success) {
    redirect('/admin/bookings?error=invalid');
  }

  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, parsed.data.bookingId),
  });

  if (!booking) {
    redirect('/admin/bookings?error=not-found');
  }

  await db.transaction(async (tx) => {
    await tx
      .update(bookings)
      .set({
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking.id));

    if (parsed.data.status === 'cancelled') {
      await tx
        .update(calendarSlots)
        .set({
          status: 'available',
          updatedAt: new Date(),
        })
        .where(eq(calendarSlots.id, booking.slotId));
    }
  });

  redirect('/admin/bookings?updated=1');
}
