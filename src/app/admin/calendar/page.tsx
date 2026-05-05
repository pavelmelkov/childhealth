import { and, asc, eq, gte } from 'drizzle-orm';
import Link from 'next/link';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { calendarSlots } from '@/db/schema';
import { getRussianDateKey, getScheduleConfig, minutesToTime } from '@/lib/schedule';

import {
  createScheduleException,
  deleteScheduleException,
  updateScheduleSettings,
  updateWeeklySchedule,
} from './actions';

type AdminCalendarPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const weekdays = [
  { value: 1, label: 'Понедельник' },
  { value: 2, label: 'Вторник' },
  { value: 3, label: 'Среда' },
  { value: 4, label: 'Четверг' },
  { value: 5, label: 'Пятница' },
  { value: 6, label: 'Суббота' },
  { value: 7, label: 'Воскресенье' },
];

const timeOptions = Array.from({ length: 29 }, (_, index) => minutesToTime(7 * 60 + index * 30));

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function formatExceptionType(type: 'closed_day' | 'closed_interval' | 'open_interval') {
  if (type === 'closed_day') {
    return 'Закрыт весь день';
  }

  if (type === 'closed_interval') {
    return 'Закрыт интервал';
  }

  return 'Открыт интервал';
}

export default async function AdminCalendarPage({ searchParams }: AdminCalendarPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const now = new Date();
  const [{ settings, weeklyHours, exceptions }, bookedSlots] = await Promise.all([
    getScheduleConfig(),
    db.query.calendarSlots.findMany({
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
      limit: 30,
    }),
  ]);

  const error = typeof params?.error === 'string' ? params.error : '';
  const saved =
    params?.settings === '1' ||
    params?.weekly === '1' ||
    params?.exception === '1' ||
    params?.deleted === '1';

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__top">
          <div>
            <p className="dashboard__eyebrow">Админка</p>
            <h1 className="dashboard__title">Рабочее расписание</h1>
          </div>
          <Link className="btn btn-outline-light" href="/admin">
            Назад
          </Link>
        </div>

        {saved ? <p className="dashboard__success">Изменения сохранены.</p> : null}
        {error === 'settings' ? <p className="dashboard__error">Проверьте настройки записи.</p> : null}
        {error === 'weekly' ? <p className="dashboard__error">Проверьте время в шаблоне недели.</p> : null}
        {error === 'exception' ? <p className="dashboard__error">Проверьте дату исключения.</p> : null}
        {error === 'exceptionTime' ? (
          <p className="dashboard__error">Для интервала укажите корректное начало и окончание.</p>
        ) : null}

        <div className="dashboard__split dashboard__split--wide">
          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Обычная запись</h2>
            <p className="dashboard__text">
              Эти настройки определяют длительность занятия и насколько далеко вперед родители
              видят свободное время.
            </p>

            <form className="dashboard__form" action={updateScheduleSettings}>
              <label className="dashboard__field">
                <span>Длительность занятия, мин</span>
                <input
                  min={15}
                  max={180}
                  name="slotDurationMinutes"
                  type="number"
                  defaultValue={settings.slotDurationMinutes}
                  required
                />
              </label>

              <label className="dashboard__field">
                <span>Открывать запись на дней</span>
                <input
                  min={1}
                  max={180}
                  name="bookingHorizonDays"
                  type="number"
                  defaultValue={settings.bookingHorizonDays}
                  required
                />
              </label>

              <label className="dashboard__field">
                <span>Минимум часов до записи</span>
                <input
                  min={0}
                  max={168}
                  name="minNoticeHours"
                  type="number"
                  defaultValue={settings.minNoticeHours}
                  required
                />
              </label>

              <button className="btn btn-primary" type="submit">
                Сохранить настройки
              </button>
            </form>
          </section>

          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Исключения</h2>
            <p className="dashboard__text">
              Закрывайте дни, закрывайте отдельное время или открывайте дополнительные интервалы,
              например в воскресенье.
            </p>

            <form className="dashboard__form" action={createScheduleException}>
              <label className="dashboard__field">
                <span>Дата</span>
                <input
                  defaultValue={getRussianDateKey(new Date())}
                  inputMode="numeric"
                  name="date"
                  pattern="\d{2}\.\d{2}\.\d{4}"
                  placeholder="дд.мм.гггг"
                  required
                />
              </label>

              <label className="dashboard__field">
                <span>Тип</span>
                <select name="type" defaultValue="closed_interval">
                  <option value="closed_day">Закрыть весь день</option>
                  <option value="closed_interval">Закрыть интервал</option>
                  <option value="open_interval">Открыть интервал</option>
                </select>
              </label>

              <label className="dashboard__field">
                <span>Начало</span>
                <select name="startsAt" defaultValue="10:00">
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <label className="dashboard__field">
                <span>Окончание</span>
                <select name="endsAt" defaultValue="11:00">
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <label className="dashboard__field dashboard__field--full">
                <span>Комментарий</span>
                <textarea name="note" rows={3} />
              </label>

              <button className="btn btn-primary" type="submit">
                Добавить исключение
              </button>
            </form>
          </section>
        </div>

        <section className="dashboard__card card-glass dashboard__section">
          <h2 className="dashboard__cardTitle">Шаблон недели</h2>
          <p className="dashboard__text">
            По умолчанию запись открыта с понедельника по субботу с 09:00 до 19:00,
            воскресенье закрыто. Здесь можно изменить обычную неделю.
          </p>

          <form action={updateWeeklySchedule}>
            <div className="scheduleWeek">
              {weekdays.map((weekday) => {
                const item = weeklyHours.find((hour) => hour.weekday === weekday.value);

                return (
                  <div className="scheduleWeek__row" key={weekday.value}>
                    <label className="scheduleWeek__enabled">
                      <input
                        name={`enabled-${weekday.value}`}
                        type="checkbox"
                        defaultChecked={item?.isEnabled}
                      />
                      <span>{weekday.label}</span>
                    </label>

                    <label className="dashboard__field">
                      <span>Начало</span>
                      <select name={`startsAt-${weekday.value}`} defaultValue={item?.startsAt ?? '09:00'}>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="dashboard__field">
                      <span>Окончание</span>
                      <select name={`endsAt-${weekday.value}`} defaultValue={item?.endsAt ?? '19:00'}>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-primary dashboard__sectionAction" type="submit">
              Сохранить шаблон недели
            </button>
          </form>
        </section>

        <div className="dashboard__split">
          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Активные исключения</h2>

            {exceptions.length === 0 ? (
              <p className="dashboard__text">Исключений пока нет.</p>
            ) : (
              <div className="dashboard__list">
                {exceptions.map((exception) => (
                  <article className="dashboard__listItem" key={exception.id}>
                    <div>
                      <strong>{exception.date.split('-').reverse().join('.')}</strong>
                      <div className="dashboard__muted">
                        {formatExceptionType(exception.type)}
                        {exception.startsAt && exception.endsAt
                          ? `: ${exception.startsAt} - ${exception.endsAt}`
                          : ''}
                      </div>
                      {exception.note ? <div className="dashboard__muted">{exception.note}</div> : null}
                    </div>

                    <form action={deleteScheduleException}>
                      <input name="id" type="hidden" value={exception.id} />
                      <button className="btn btn-outline-light btn-sm" type="submit">
                        Удалить
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Ближайшие бронирования</h2>

            {bookedSlots.length === 0 ? (
              <p className="dashboard__text">Пока нет будущих бронирований.</p>
            ) : (
              <div className="dashboard__list">
                {bookedSlots.map((slot) => (
                  <article className="dashboard__listItem" key={slot.id}>
                    <div>
                      <strong>{formatDateTime(slot.startsAt)}</strong>
                      <div className="dashboard__muted">до {formatDateTime(slot.endsAt)}</div>
                      {slot.booking ? (
                        <div className="dashboard__muted">
                          {slot.booking.parent.fullName}, ребенок: {slot.booking.child.name}
                        </div>
                      ) : null}
                    </div>
                    <span className="dashboard__pill dashboard__pill--booked">Занят</span>
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
