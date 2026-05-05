'use client';

import { useMemo, useState } from 'react';

import { bookCalendarSlot } from '@/app/cabinet/actions';

type CalendarChild = {
  id: string;
  name: string;
};

type CalendarSlot = {
  key: string;
  dateKey: string;
  timeLabel: string;
  startsAt: string;
  endsAt: string;
};

type BookingCalendarProps = {
  childrenList: CalendarChild[];
  slots: CalendarSlot[];
};

const weekdayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function buildMonthDays(referenceDate: Date) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayBasedOffset = (firstDay.getDay() + 6) % 7;
  const days: Array<{ date: Date | null; key: string; dayNumber: number | null }> = [];

  for (let index = 0; index < mondayBasedOffset; index += 1) {
    days.push({ date: null, key: `empty-${index}`, dayNumber: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    days.push({ date, key: getDateKey(date), dayNumber: day });
  }

  return days;
}

function formatSelectedDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-');

  return `${day}.${month}.${year}`;
}

export function BookingCalendar({ childrenList, slots }: BookingCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        year: 'numeric',
      }).format(today),
    [today],
  );
  const days = useMemo(() => buildMonthDays(today), [today]);
  const slotsByDate = useMemo(() => {
    return slots.reduce<Record<string, CalendarSlot[]>>((acc, slot) => {
      acc[slot.dateKey] ??= [];
      acc[slot.dateKey].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const firstAvailableDate = slots[0]?.dateKey ?? getDateKey(today);
  const [selectedDate, setSelectedDate] = useState(firstAvailableDate);
  const selectedSlots = slotsByDate[selectedDate] ?? [];
  const selectedSlot = selectedSlots[0];

  return (
    <div className="bookingCalendar">
      <div className="bookingCalendar__head">
        <h2 className="dashboard__cardTitle">Календарь записи</h2>
        <span className="bookingCalendar__month">{monthLabel}</span>
      </div>

      <div className="bookingCalendar__weekdays">
        {weekdayLabels.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="bookingCalendar__grid">
        {days.map((day) => {
          const availableCount = day.date ? slotsByDate[day.key]?.length ?? 0 : 0;
          const isSelected = day.key === selectedDate;
          const isSelectable = Boolean(day.date && availableCount > 0);

          return (
            <button
              className={[
                'bookingCalendar__day',
                availableCount > 0 ? 'bookingCalendar__day--available' : '',
                isSelected ? 'bookingCalendar__day--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={!isSelectable}
              key={day.key}
              type="button"
              onClick={() => setSelectedDate(day.key)}
            >
              <span>{day.dayNumber}</span>
              {availableCount > 0 ? <small>{availableCount}</small> : null}
            </button>
          );
        })}
      </div>

      <div className="bookingCalendar__slots">
        <h3 className="bookingCalendar__slotsTitle">Свободное время</h3>

        {childrenList.length === 0 ? (
          <p className="dashboard__text">К вашему аккаунту пока не привязан ребенок.</p>
        ) : selectedSlots.length === 0 ? (
          <p className="dashboard__text">
            На {formatSelectedDate(selectedDate)} свободных окон нет. Выберите зеленый день в календаре.
          </p>
        ) : (
          <form className="bookingCalendar__singleForm" action={bookCalendarSlot}>
            <input name="startsAt" type="hidden" value={selectedSlot.startsAt} />
            <input name="endsAt" type="hidden" value={selectedSlot.endsAt} />

            <div className="bookingCalendar__selectedDate">
              <strong>{formatSelectedDate(selectedDate)}</strong>
              <span>{selectedSlots.length} свободных окон</span>
            </div>

            <label className="bookingCalendar__selectField">
              <span>Время</span>
              <select
                name="timeWindow"
                required
                onChange={(event) => {
                  const slot = selectedSlots.find((item) => item.key === event.currentTarget.value);
                  const form = event.currentTarget.form;

                  if (!slot || !form) {
                    return;
                  }

                  const startsAtInput = form.elements.namedItem('startsAt') as HTMLInputElement | null;
                  const endsAtInput = form.elements.namedItem('endsAt') as HTMLInputElement | null;

                  if (startsAtInput) {
                    startsAtInput.value = slot.startsAt;
                  }

                  if (endsAtInput) {
                    endsAtInput.value = slot.endsAt;
                  }
                }}
              >
                {selectedSlots.map((slot) => (
                  <option key={slot.key} value={slot.key}>
                    {slot.timeLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="bookingCalendar__selectField">
              <span>Ребенок</span>
              <select name="childId" required>
                {childrenList.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </label>

            <button className="btn btn-primary" type="submit">
              Забронировать
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
