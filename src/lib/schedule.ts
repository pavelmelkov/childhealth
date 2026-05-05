import { and, asc, eq, gte, lte } from 'drizzle-orm';

import { db } from '@/db';
import {
  calendarSlots,
  scheduleExceptions,
  scheduleSettings,
  weeklyWorkingHours,
  type ScheduleException,
  type ScheduleSettings,
  type WeeklyWorkingHours,
} from '@/db/schema';

export type AvailableScheduleSlot = {
  key: string;
  dateKey: string;
  startsAt: Date;
  endsAt: Date;
};

type TimeInterval = {
  startMinutes: number;
  endMinutes: number;
};

const defaultWeek = [
  { weekday: 1, isEnabled: true, startsAt: '09:00', endsAt: '19:00' },
  { weekday: 2, isEnabled: true, startsAt: '09:00', endsAt: '19:00' },
  { weekday: 3, isEnabled: true, startsAt: '09:00', endsAt: '19:00' },
  { weekday: 4, isEnabled: true, startsAt: '09:00', endsAt: '19:00' },
  { weekday: 5, isEnabled: true, startsAt: '09:00', endsAt: '19:00' },
  { weekday: 6, isEnabled: true, startsAt: '09:00', endsAt: '19:00' },
  { weekday: 7, isEnabled: false, startsAt: '09:00', endsAt: '19:00' },
];

export function getDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getRussianDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${day}.${month}.${year}`;
}

export function parseTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function minutesToTime(value: number) {
  const hours = String(Math.floor(value / 60)).padStart(2, '0');
  const minutes = String(value % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function weekdayFromDate(date: Date) {
  const weekday = date.getDay();
  return weekday === 0 ? 7 : weekday;
}

function dateAtMinutes(date: Date, minutes: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Math.floor(minutes / 60),
    minutes % 60,
  );
}

function subtractInterval(intervals: TimeInterval[], closed: TimeInterval) {
  return intervals.flatMap((interval) => {
    if (closed.endMinutes <= interval.startMinutes || closed.startMinutes >= interval.endMinutes) {
      return [interval];
    }

    const result: TimeInterval[] = [];

    if (closed.startMinutes > interval.startMinutes) {
      result.push({
        startMinutes: interval.startMinutes,
        endMinutes: closed.startMinutes,
      });
    }

    if (closed.endMinutes < interval.endMinutes) {
      result.push({
        startMinutes: closed.endMinutes,
        endMinutes: interval.endMinutes,
      });
    }

    return result;
  });
}

function normalizeIntervals(intervals: TimeInterval[]) {
  const sortedIntervals = intervals
    .filter((interval) => interval.endMinutes > interval.startMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  return sortedIntervals.reduce<TimeInterval[]>((acc, interval) => {
    const previous = acc.at(-1);

    if (!previous || interval.startMinutes > previous.endMinutes) {
      acc.push({ ...interval });
      return acc;
    }

    previous.endMinutes = Math.max(previous.endMinutes, interval.endMinutes);
    return acc;
  }, []);
}

export async function ensureScheduleDefaults() {
  const existingSettings = await db.query.scheduleSettings.findFirst({
    where: eq(scheduleSettings.singletonKey, 'default'),
  });

  if (!existingSettings) {
    await db.insert(scheduleSettings).values({
      singletonKey: 'default',
      slotDurationMinutes: 60,
      bookingHorizonDays: 30,
      minNoticeHours: 12,
    });
  }

  const existingWeek = await db.query.weeklyWorkingHours.findMany();
  const existingWeekdays = new Set(existingWeek.map((item) => item.weekday));
  const missingWeekdays = defaultWeek.filter((item) => !existingWeekdays.has(item.weekday));

  if (missingWeekdays.length > 0) {
    await db.insert(weeklyWorkingHours).values(missingWeekdays);
  }
}

export async function getScheduleConfig() {
  await ensureScheduleDefaults();

  const [settings, weeklyHours, exceptions] = await Promise.all([
    db.query.scheduleSettings.findFirst({
      where: eq(scheduleSettings.singletonKey, 'default'),
    }),
    db.query.weeklyWorkingHours.findMany({
      orderBy: asc(weeklyWorkingHours.weekday),
    }),
    db.query.scheduleExceptions.findMany({
      orderBy: asc(scheduleExceptions.date),
    }),
  ]);

  return {
    settings: settings as ScheduleSettings,
    weeklyHours,
    exceptions,
  };
}

export async function getAvailableScheduleSlots() {
  const { settings, weeklyHours, exceptions } = await getScheduleConfig();
  const today = new Date();
  const latestDate = new Date(today);
  latestDate.setDate(today.getDate() + settings.bookingHorizonDays);

  const bookedSlots = await db.query.calendarSlots.findMany({
    where: and(
      eq(calendarSlots.status, 'booked'),
      gte(calendarSlots.startsAt, today),
      lte(calendarSlots.startsAt, latestDate),
    ),
  });
  const bookedKeys = new Set(bookedSlots.map((slot) => slot.startsAt.getTime()));
  const minStartTime = new Date(today.getTime() + settings.minNoticeHours * 60 * 60 * 1000);
  const exceptionsByDate = exceptions.reduce<Record<string, ScheduleException[]>>((acc, exception) => {
    acc[exception.date] ??= [];
    acc[exception.date].push(exception);
    return acc;
  }, {});
  const weeklyByDay = weeklyHours.reduce<Record<number, WeeklyWorkingHours>>((acc, item) => {
    acc[item.weekday] = item;
    return acc;
  }, {});
  const result: AvailableScheduleSlot[] = [];

  for (let offset = 0; offset <= settings.bookingHorizonDays; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dateKey = getDateKey(date);
    const dayExceptions = exceptionsByDate[dateKey] ?? [];
    const weeklyTemplate = weeklyByDay[weekdayFromDate(date)];
    let intervals: TimeInterval[] = [];

    if (weeklyTemplate?.isEnabled) {
      const startMinutes = parseTime(weeklyTemplate.startsAt);
      const endMinutes = parseTime(weeklyTemplate.endsAt);

      if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
        intervals.push({ startMinutes, endMinutes });
      }
    }

    if (dayExceptions.some((exception) => exception.type === 'closed_day')) {
      intervals = [];
    }

    for (const exception of dayExceptions) {
      if (exception.type !== 'open_interval' || !exception.startsAt || !exception.endsAt) {
        continue;
      }

      const startMinutes = parseTime(exception.startsAt);
      const endMinutes = parseTime(exception.endsAt);

      if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
        intervals.push({ startMinutes, endMinutes });
      }
    }

    intervals = normalizeIntervals(intervals);

    for (const exception of dayExceptions) {
      if (exception.type !== 'closed_interval' || !exception.startsAt || !exception.endsAt) {
        continue;
      }

      const startMinutes = parseTime(exception.startsAt);
      const endMinutes = parseTime(exception.endsAt);

      if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
        intervals = subtractInterval(intervals, { startMinutes, endMinutes });
      }
    }

    for (const interval of intervals) {
      for (
        let startMinutes = interval.startMinutes;
        startMinutes + settings.slotDurationMinutes <= interval.endMinutes;
        startMinutes += settings.slotDurationMinutes
      ) {
        const startsAt = dateAtMinutes(date, startMinutes);
        const endsAt = dateAtMinutes(date, startMinutes + settings.slotDurationMinutes);

        if (startsAt < minStartTime || bookedKeys.has(startsAt.getTime())) {
          continue;
        }

        result.push({
          key: startsAt.toISOString(),
          dateKey,
          startsAt,
          endsAt,
        });
      }
    }
  }

  return result;
}
