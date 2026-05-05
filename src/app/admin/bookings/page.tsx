import { and, asc, eq, gte } from 'drizzle-orm';
import Link from 'next/link';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { calendarSlots } from '@/db/schema';

import { updateBookingStatus } from './actions';

type AdminBookingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function formatDay(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(value);
}

function getDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatStatus(status: BookingStatus) {
  if (status === 'pending') {
    return 'Ожидает';
  }

  if (status === 'confirmed') {
    return 'Подтверждена';
  }

  return 'Отменена';
}

function getWeekDays(referenceDate: Date) {
  const start = new Date(referenceDate);
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function getTimeRows() {
  return Array.from({ length: 11 }, (_, index) => `${String(9 + index).padStart(2, '0')}:00`);
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const now = new Date();
  const slots = await db.query.calendarSlots.findMany({
    where: and(eq(calendarSlots.status, 'booked'), gte(calendarSlots.startsAt, now)),
    with: {
      booking: {
        with: {
          parent: true,
          child: true,
        },
      },
    },
    orderBy: asc(calendarSlots.startsAt),
    limit: 100,
  });
  const bookedItems = slots.flatMap((slot) => (slot.booking ? [{ slot, booking: slot.booking }] : []));
  const pendingCount = bookedItems.filter((item) => item.booking.status === 'pending').length;
  const confirmedCount = bookedItems.filter((item) => item.booking.status === 'confirmed').length;
  const updated = params?.updated === '1';
  const error = typeof params?.error === 'string' ? params.error : '';
  const weekDays = getWeekDays(now);
  const timeRows = getTimeRows();

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__top">
          <div>
            <p className="dashboard__eyebrow">Админка</p>
            <h1 className="dashboard__title">Записи родителей</h1>
          </div>
          <Link className="btn btn-outline-light" href="/admin">
            Назад
          </Link>
        </div>

        {updated ? <p className="dashboard__success">Статус записи обновлен.</p> : null}
        {error ? <p className="dashboard__error">Не удалось обновить запись.</p> : null}

        <div className="dashboard__stats">
          <article className="dashboard__stat card-glass">
            <span>Всего будущих записей</span>
            <strong>{bookedItems.length}</strong>
          </article>
          <article className="dashboard__stat card-glass">
            <span>Ожидают подтверждения</span>
            <strong>{pendingCount}</strong>
          </article>
          <article className="dashboard__stat card-glass">
            <span>Подтверждены</span>
            <strong>{confirmedCount}</strong>
          </article>
        </div>

        <section className="dashboard__card card-glass dashboard__section">
          <div className="dashboard__sectionHead">
            <div>
              <h2 className="dashboard__cardTitle">Неделя по времени</h2>
              <p className="dashboard__text">
                Здесь видно, какие дни и часы уже заняты. На узком экране таблицу можно прокрутить.
              </p>
            </div>
          </div>

          <div className="weekBoard" aria-label="Занятые записи на неделю">
            <div className="weekBoard__grid">
              <div className="weekBoard__corner" />
              {weekDays.map((day) => (
                <div className="weekBoard__dayHead" key={getDateKey(day)}>
                  {formatDay(day)}
                </div>
              ))}

              {timeRows.map((time) => (
                <div className="weekBoard__row" key={time}>
                  <div className="weekBoard__time">{time}</div>

                  {weekDays.map((day) => {
                    const dayKey = getDateKey(day);
                    const cellBookings = bookedItems.filter(
                      ({ slot }) => getDateKey(slot.startsAt) === dayKey && formatTime(slot.startsAt) === time,
                    );

                    return (
                      <div className="weekBoard__cell" key={`${dayKey}-${time}`}>
                        {cellBookings.map(({ slot, booking }) => (
                          <div className={`weekBoard__booking weekBoard__booking--${booking.status}`} key={booking.id}>
                            <strong>{booking.child.name}</strong>
                            <span>{booking.parent.fullName}</span>
                            <small>
                              {formatTime(slot.startsAt)} - {formatTime(slot.endsAt)}
                            </small>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard__card card-glass dashboard__section">
          <h2 className="dashboard__cardTitle">Ближайшие записи</h2>

          {bookedItems.length === 0 ? (
            <p className="dashboard__text">Пока нет будущих записей.</p>
          ) : (
            <div className="dashboard__table">
              {bookedItems.map(({ slot, booking }) => (
                <article className="dashboard__bookingRow" key={booking.id}>
                  <div>
                    <strong>{formatDateTime(slot.startsAt)}</strong>
                    <div className="dashboard__muted">до {formatDateTime(slot.endsAt)}</div>
                  </div>

                  <div>
                    <strong>{booking.parent.fullName}</strong>
                    <div className="dashboard__muted">{booking.parent.email}</div>
                    {booking.parent.phone ? <div className="dashboard__muted">{booking.parent.phone}</div> : null}
                  </div>

                  <div>
                    <strong>{booking.child.name}</strong>
                    {booking.child.age ? <div className="dashboard__muted">{booking.child.age}</div> : null}
                  </div>

                  <span className={`dashboard__pill dashboard__pill--${booking.status}`}>
                    {formatStatus(booking.status)}
                  </span>

                  <div className="dashboard__bookingActions">
                    {booking.status !== 'confirmed' ? (
                      <form action={updateBookingStatus}>
                        <input name="bookingId" type="hidden" value={booking.id} />
                        <input name="status" type="hidden" value="confirmed" />
                        <button className="btn btn-success btn-sm" type="submit">
                          Подтвердить
                        </button>
                      </form>
                    ) : null}

                    {booking.status !== 'cancelled' ? (
                      <form action={updateBookingStatus}>
                        <input name="bookingId" type="hidden" value={booking.id} />
                        <input name="status" type="hidden" value="cancelled" />
                        <button className="btn btn-outline-light btn-sm" type="submit">
                          Отменить
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
