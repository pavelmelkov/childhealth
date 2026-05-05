import { asc, eq } from 'drizzle-orm';

import { requireSession } from '@/auth/guards';
import { SignOutButton } from '@/components/Auth/SignOutButton';
import { BookingCalendar } from '@/components/Cabinet/BookingCalendar';
import { db } from '@/db';
import { bookings, children } from '@/db/schema';
import { getAvailableScheduleSlots } from '@/lib/schedule';

type CabinetPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function formatTimeRange(startsAt: Date, endsAt: Date) {
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formatter.format(startsAt)} - ${formatter.format(endsAt)}`;
}

function getLocalDateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default async function CabinetPage({ searchParams }: CabinetPageProps) {
  const session = await requireSession();

  if (session.user.role === 'admin') {
    return (
      <main className="dashboard">
        <div className="container">
          <div className="dashboard__top">
            <div>
              <p className="dashboard__eyebrow">Администратор</p>
              <h1 className="dashboard__title">Для админки используйте раздел /admin</h1>
            </div>
            <SignOutButton />
          </div>
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const booked = params?.booked === '1';
  const error = typeof params?.error === 'string' ? params.error : '';

  const [parentChildren, availableSlots, parentBookings] = await Promise.all([
    db.query.children.findMany({
      where: eq(children.parentId, session.user.id),
      orderBy: asc(children.createdAt),
    }),
    getAvailableScheduleSlots(),
    db.query.bookings.findMany({
      where: eq(bookings.parentId, session.user.id),
      with: {
        child: true,
        slot: true,
      },
      orderBy: asc(bookings.createdAt),
      limit: 20,
    }),
  ]);

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__top">
          <div>
            <p className="dashboard__eyebrow">Кабинет родителя</p>
            <h1 className="dashboard__title">Здравствуйте, {session.user.name}</h1>
          </div>
          <SignOutButton />
        </div>

        {booked ? <p className="dashboard__success">Запись создана. Администратор увидит бронирование.</p> : null}
        {error === 'slot' ? <p className="dashboard__error">Этот слот уже недоступен.</p> : null}
        {error === 'child' ? <p className="dashboard__error">Ребенок не найден в вашем кабинете.</p> : null}
        {error === 'invalid' ? <p className="dashboard__error">Не удалось создать запись.</p> : null}

        <div className="dashboard__split dashboard__split--wide">
          <section className="dashboard__card card-glass">
            <BookingCalendar
              childrenList={parentChildren.map((child) => ({
                id: child.id,
                name: child.name,
              }))}
              slots={availableSlots.map((slot) => ({
                key: slot.key,
                dateKey: getLocalDateKey(slot.startsAt),
                timeLabel: formatTimeRange(slot.startsAt, slot.endsAt),
                startsAt: slot.startsAt.toISOString(),
                endsAt: slot.endsAt.toISOString(),
              }))}
            />
          </section>

          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Мои записи</h2>

            {parentBookings.length === 0 ? (
              <p className="dashboard__text">Пока нет забронированных занятий.</p>
            ) : (
              <div className="dashboard__list">
                {parentBookings.map((booking) => (
                  <article className="dashboard__listItem" key={booking.id}>
                    <div>
                      <strong>{formatDateTime(booking.slot.startsAt)}</strong>
                      <div className="dashboard__muted">Ребенок: {booking.child.name}</div>
                    </div>
                    <span className={`dashboard__pill dashboard__pill--${booking.status}`}>
                      {booking.status === 'pending'
                        ? 'Ожидает'
                        : booking.status === 'confirmed'
                          ? 'Подтверждена'
                          : 'Отменена'}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
