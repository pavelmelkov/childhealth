import Link from 'next/link';

import { requireAdmin } from '@/auth/guards';
import { AdminPushNotifications } from '@/components/Admin/AdminPushNotifications';
import { SignOutButton } from '@/components/Auth/SignOutButton';

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__top">
          <div>
            <p className="dashboard__eyebrow">Админка</p>
            <h1 className="dashboard__title">Управление кабинетами</h1>
          </div>
          <SignOutButton />
        </div>

        <div className="dashboard__grid">
          <Link className="dashboard__card dashboard__cardLink card-glass" href="/admin/bookings">
            <h2 className="dashboard__cardTitle">Записи родителей</h2>
            <p className="dashboard__text">
              Смотрите ближайшие бронирования, родителей, детей и подтверждайте занятия.
            </p>
          </Link>

          <Link className="dashboard__card dashboard__cardLink card-glass" href="/admin/calendar">
            <h2 className="dashboard__cardTitle">Рабочее расписание</h2>
            <p className="dashboard__text">
              Настраивайте шаблон недели, закрытые дни и дополнительные интервалы.
            </p>
          </Link>

          <Link className="dashboard__card dashboard__cardLink card-glass" href="/admin/parents">
            <h2 className="dashboard__cardTitle">Родители и дети</h2>
            <p className="dashboard__text">
              Создавайте родителей, задавайте пароль для входа и привязывайте детей.
            </p>
          </Link>

          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Публикации</h2>
            <p className="dashboard__text">
              Следующий раздел: новости, домашние задания и публикации об успехах ребенка.
            </p>
          </section>
          <AdminPushNotifications />
        </div>
      </div>
    </main>
  );
}
