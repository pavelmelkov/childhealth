import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { users } from '@/db/schema';

import { createParentWithChild } from './actions';

type AdminParentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminParentsPage({ searchParams }: AdminParentsPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const parents = await db.query.users.findMany({
    where: eq(users.role, 'parent'),
    with: {
      children: true,
    },
    orderBy: desc(users.createdAt),
  });

  const error = typeof params?.error === 'string' ? params.error : '';
  const created = params?.created === '1';

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboard__top">
          <div>
            <p className="dashboard__eyebrow">Админка</p>
            <h1 className="dashboard__title">Родители и дети</h1>
          </div>
          <Link className="btn btn-outline-light" href="/admin">
            Назад
          </Link>
        </div>

        <div className="dashboard__split">
          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Создать родителя</h2>
            <p className="dashboard__text">
              Обязательные поля: ФИО, телефон, пароль, имя и возраст ребенка. Email можно
              добавить позже.
            </p>

            {created ? <p className="dashboard__success">Родитель и ребенок созданы.</p> : null}
            {error === 'email' ? (
              <p className="dashboard__error">Пользователь с таким email уже есть.</p>
            ) : null}
            {error === 'phone' ? (
              <p className="dashboard__error">Пользователь с таким телефоном уже есть.</p>
            ) : null}
            {error === 'invalid' ? (
              <p className="dashboard__error">
                Проверьте форму. Пароль: минимум 8 символов, строчная и заглавная буква,
                цифра и специальный символ.
              </p>
            ) : null}

            <form className="dashboard__form" action={createParentWithChild}>
              <label className="dashboard__field">
                <span>ФИО родителя *</span>
                <input name="fullName" required />
              </label>

              <label className="dashboard__field">
                <span>Телефон *</span>
                <input name="phone" required />
              </label>

              <label className="dashboard__field">
                <span>Email</span>
                <input name="email" type="email" />
              </label>

              <label className="dashboard__field">
                <span>Пароль *</span>
                <input
                  name="password"
                  type="password"
                  minLength={8}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                  title="Минимум 8 символов: строчная и заглавная буква, цифра и специальный символ."
                  required
                />
              </label>

              <label className="dashboard__field">
                <span>Имя ребенка *</span>
                <input name="childName" required />
              </label>

              <label className="dashboard__field">
                <span>Возраст ребенка *</span>
                <input name="childAge" placeholder="например: 5 лет" required />
              </label>

              <label className="dashboard__field dashboard__field--full">
                <span>Заметки</span>
                <textarea name="childNotes" rows={4} />
              </label>

              <button className="btn btn-primary" type="submit">
                Создать
              </button>
            </form>
          </section>

          <section className="dashboard__card card-glass">
            <h2 className="dashboard__cardTitle">Список родителей</h2>

            {parents.length === 0 ? (
              <p className="dashboard__text">Пока нет созданных родителей.</p>
            ) : (
              <div className="dashboard__list">
                {parents.map((parent) => (
                  <article className="dashboard__listItem" key={parent.id}>
                    <div>
                      <strong>{parent.fullName}</strong>
                      {parent.phone ? <div className="dashboard__muted">{parent.phone}</div> : null}
                      {parent.email ? <div className="dashboard__muted">{parent.email}</div> : null}
                    </div>

                    <div className="dashboard__children">
                      {parent.children.map((child) => (
                        <span className="dashboard__pill" key={child.id}>
                          {child.name}
                          {child.age ? `, ${child.age}` : ''}
                        </span>
                      ))}
                    </div>
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
