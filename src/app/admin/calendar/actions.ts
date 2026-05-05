'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { scheduleExceptions, scheduleSettings, weeklyWorkingHours } from '@/db/schema';
import { ensureScheduleDefaults, parseTime } from '@/lib/schedule';

const settingsSchema = z.object({
  slotDurationMinutes: z.coerce.number().int().min(15).max(180),
  bookingHorizonDays: z.coerce.number().int().min(1).max(180),
  minNoticeHours: z.coerce.number().int().min(0).max(168),
});

const exceptionSchema = z.object({
  date: z.string().trim().min(1),
  type: z.enum(['closed_day', 'closed_interval', 'open_interval']),
  startsAt: z.string().trim().optional(),
  endsAt: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

function normalizeDate(value: string) {
  const dotDateMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!dotDateMatch && !isoDateMatch) {
    return null;
  }

  const day = dotDateMatch?.[1] ?? isoDateMatch?.[3];
  const month = dotDateMatch?.[2] ?? isoDateMatch?.[2];
  const year = dotDateMatch?.[3] ?? isoDateMatch?.[1];
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

function validateTimeInterval(startsAt?: string, endsAt?: string) {
  if (!startsAt || !endsAt) {
    return false;
  }

  const startMinutes = parseTime(startsAt);
  const endMinutes = parseTime(endsAt);

  return startMinutes !== null && endMinutes !== null && endMinutes > startMinutes;
}

export async function updateScheduleSettings(formData: FormData) {
  await requireAdmin();
  await ensureScheduleDefaults();

  const parsed = settingsSchema.safeParse({
    slotDurationMinutes: formData.get('slotDurationMinutes'),
    bookingHorizonDays: formData.get('bookingHorizonDays'),
    minNoticeHours: formData.get('minNoticeHours'),
  });

  if (!parsed.success) {
    redirect('/admin/calendar?error=settings');
  }

  await db
    .update(scheduleSettings)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(scheduleSettings.singletonKey, 'default'));

  redirect('/admin/calendar?settings=1');
}

export async function updateWeeklySchedule(formData: FormData) {
  await requireAdmin();
  await ensureScheduleDefaults();

  for (let weekday = 1; weekday <= 7; weekday += 1) {
    const isEnabled = formData.get(`enabled-${weekday}`) === 'on';
    const startsAt = String(formData.get(`startsAt-${weekday}`) ?? '09:00');
    const endsAt = String(formData.get(`endsAt-${weekday}`) ?? '19:00');

    if (isEnabled && !validateTimeInterval(startsAt, endsAt)) {
      redirect('/admin/calendar?error=weekly');
    }

    await db
      .update(weeklyWorkingHours)
      .set({
        isEnabled,
        startsAt,
        endsAt,
        updatedAt: new Date(),
      })
      .where(eq(weeklyWorkingHours.weekday, weekday));
  }

  redirect('/admin/calendar?weekly=1');
}

export async function createScheduleException(formData: FormData) {
  const session = await requireAdmin();
  await ensureScheduleDefaults();

  const parsed = exceptionSchema.safeParse({
    date: formData.get('date'),
    type: formData.get('type'),
    startsAt: formData.get('startsAt') || undefined,
    endsAt: formData.get('endsAt') || undefined,
    note: formData.get('note'),
  });

  if (!parsed.success) {
    redirect('/admin/calendar?error=exception');
  }

  const date = normalizeDate(parsed.data.date);

  if (!date) {
    redirect('/admin/calendar?error=exception');
  }

  const needsTime = parsed.data.type !== 'closed_day';

  if (needsTime && !validateTimeInterval(parsed.data.startsAt, parsed.data.endsAt)) {
    redirect('/admin/calendar?error=exceptionTime');
  }

  await db.insert(scheduleExceptions).values({
    date,
    type: parsed.data.type,
    startsAt: needsTime ? parsed.data.startsAt : null,
    endsAt: needsTime ? parsed.data.endsAt : null,
    note: parsed.data.note || null,
    createdById: session.user.id,
  });

  redirect('/admin/calendar?exception=1');
}

export async function deleteScheduleException(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');

  if (!id) {
    redirect('/admin/calendar?error=exception');
  }

  await db.delete(scheduleExceptions).where(and(eq(scheduleExceptions.id, id)));
  redirect('/admin/calendar?deleted=1');
}
