# Drizzle + PostgreSQL в этом проекте

Этот файл объясняет, что уже добавлено в проект, зачем нужен Drizzle ORM и как он работает вместе с PostgreSQL.

## Что уже установлено

В проект добавлены зависимости:

```bash
npm.cmd install drizzle-orm postgres next-auth @auth/drizzle-adapter bcryptjs zod
npm.cmd install -D drizzle-kit
```

Что за что отвечает:

- `drizzle-orm` - сама ORM, через нее описываем таблицы и пишем типизированные запросы.
- `postgres` - драйвер подключения к PostgreSQL.
- `drizzle-kit` - CLI-инструмент для генерации миграций и работы со схемой.
- `next-auth` - будущая основа для авторизации.
- `@auth/drizzle-adapter` - адаптер Auth.js/NextAuth для Drizzle, может пригодиться позже.
- `bcryptjs` - хеширование паролей.
- `zod` - валидация данных форм и API.

## Какие файлы добавлены

```txt
src/db/schema.ts       схема базы данных
src/db/index.ts        подключение к PostgreSQL
drizzle.config.ts      конфиг Drizzle Kit
.env.example           пример переменных окружения
drizzle/               папка с SQL-миграциями
```

В `package.json` добавлены команды:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

## Как Drizzle связан с PostgreSQL

PostgreSQL - это настоящая база данных. В ней физически лежат таблицы, строки, индексы и связи.

Drizzle - это TypeScript-слой между приложением и PostgreSQL.

Упрощенно:

```txt
Next.js код
  ↓
Drizzle ORM
  ↓
postgres driver
  ↓
PostgreSQL
```

Ты описываешь таблицы в TypeScript, а Drizzle Kit по этой схеме генерирует SQL.

Например, в `src/db/schema.ts`:

```ts
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: text('password_hash').notNull(),
});
```

Drizzle понимает это как PostgreSQL-таблицу:

```sql
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "password_hash" text NOT NULL
);
```

То есть Drizzle не заменяет PostgreSQL. Он помогает описывать и использовать PostgreSQL из TypeScript.

## Главная схема проекта

Сейчас база рассчитана на личные кабинеты родителей, календарь записи и админку.

### users

Пользователи системы.

```txt
users
- id
- email
- password_hash
- role
- full_name
- phone
- created_at
- updated_at
```

Роли:

```ts
export const userRoleEnum = pgEnum('user_role', ['admin', 'parent']);
```

Это значит:

- `admin` - администратор;
- `parent` - родитель.

### children

Дети, привязанные к родителю.

```txt
children
- id
- parent_id
- name
- age
- notes
- created_at
- updated_at
```

Связь:

```txt
children.parent_id -> users.id
```

Один родитель может иметь несколько детей.

### calendar_slots

Свободные или занятые слоты календаря.

```txt
calendar_slots
- id
- starts_at
- ends_at
- status
- admin_note
- created_by_id
- created_at
- updated_at
```

Статусы:

```ts
export const slotStatusEnum = pgEnum('slot_status', [
  'available',
  'booked',
  'blocked',
]);
```

Значения:

- `available` - свободно;
- `booked` - забронировано;
- `blocked` - закрыто администратором.

### bookings

Записи родителей на занятия.

```txt
bookings
- id
- slot_id
- parent_id
- child_id
- status
- parent_comment
- admin_comment
- created_at
- updated_at
```

Связи:

```txt
bookings.slot_id -> calendar_slots.id
bookings.parent_id -> users.id
bookings.child_id -> children.id
```

Для `slot_id` создан уникальный индекс. Это важно: один слот нельзя забронировать дважды.

Статусы записи:

```ts
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
]);
```

### posts

Публикации администратора: новости, успехи, домашние задания.

```txt
posts
- id
- title
- content
- type
- audience
- parent_id
- child_id
- created_by_id
- published_at
- created_at
- updated_at
```

Типы:

```ts
export const postTypeEnum = pgEnum('post_type', [
  'news',
  'progress',
  'homework',
]);
```

Аудитория:

```ts
export const postAudienceEnum = pgEnum('post_audience', [
  'all',
  'parent',
  'child',
]);
```

Примеры:

- `audience = 'all'` - новость для всех родителей;
- `audience = 'parent'` - сообщение конкретному родителю;
- `audience = 'child'` - публикация про конкретного ребенка.

### post_reads

Отметки о прочтении публикаций.

```txt
post_reads
- post_id
- parent_id
- read_at
```

Уникальный индекс:

```txt
post_id + parent_id
```

Это значит: один родитель может отметить одну публикацию прочитанной только один раз.

## Что такое relations в Drizzle

Внизу `src/db/schema.ts` есть блоки `relations`.

Например:

```ts
export const childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(users, {
    fields: [children.parentId],
    references: [users.id],
  }),
  bookings: many(bookings),
  posts: many(posts),
}));
```

Это не создает новую таблицу в PostgreSQL.

Это подсказка для Drizzle: как удобно подтягивать связанные данные в TypeScript.

Например, ребенок связан:

- с одним родителем;
- со многими записями;
- со многими публикациями.

## Как работает миграция

Схема лежит здесь:

```txt
src/db/schema.ts
```

SQL-миграции лежат здесь:

```txt
drizzle/
```

Когда ты меняешь схему, нужно выполнить:

```bash
npm.cmd run db:generate
```

Drizzle Kit сравнит схему и создаст новый SQL-файл миграции.

Затем, когда есть реальная PostgreSQL база и переменная `DATABASE_URL`, можно выполнить:

```bash
npm.cmd run db:migrate
```

Эта команда применит SQL-миграции к базе.

## Настройка DATABASE_URL

В корне есть `.env.example`:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/landing"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
```

Нужно будет создать рядом файл `.env.local` и указать реальные значения:

```env
DATABASE_URL="postgres://user:password@host:5432/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="длинная_секретная_строка"
```

Файл `.env.local` не должен попадать в git.

## Как подключение к базе сделано в проекте

Файл:

```txt
src/db/index.ts
```

Код:

```ts
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const queryClient = postgres(connectionString, {
  max: 1,
  prepare: false,
});

export const db = drizzle(queryClient, { schema });
```

Что здесь происходит:

1. Берем строку подключения из `DATABASE_URL`.
2. Создаем подключение через пакет `postgres`.
3. Передаем это подключение в Drizzle.
4. Экспортируем `db`, через который потом будем делать запросы.

## Примеры будущих запросов

Получить пользователя по email:

```ts
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

const user = await db.query.users.findFirst({
  where: eq(users.email, email),
});
```

Создать свободный слот:

```ts
import { db } from '@/db';
import { calendarSlots } from '@/db/schema';

await db.insert(calendarSlots).values({
  startsAt: new Date('2026-05-10T10:00:00+03:00'),
  endsAt: new Date('2026-05-10T11:00:00+03:00'),
  status: 'available',
});
```

Забронировать слот:

```ts
import { db } from '@/db';
import { bookings } from '@/db/schema';

await db.insert(bookings).values({
  slotId,
  parentId,
  childId,
  status: 'pending',
});
```

## Почему Drizzle удобен для обучения

Drizzle хорош тем, что он близок к SQL.

Ты видишь:

- какие таблицы есть;
- какие поля есть;
- какие связи есть;
- какие индексы есть;
- какой SQL генерируется.

При этом TypeScript помогает не ошибаться в названиях колонок и типах данных.

## Что будет следующим шагом

Следующий логичный этап:

1. Сделать страницу `/login`.
2. Настроить серверную проверку email + password.
3. Хешировать пароли через `bcryptjs`.
4. Добавить сессию через NextAuth/Auth.js.
5. Защитить `/cabinet` для родителей.
6. Защитить `/admin` только для администратора.
7. Сделать первые страницы:
   - кабинет родителя;
   - календарь записи;
   - админку слотов;
   - публикации администратора.

## Важное про безопасность

Для этого проекта нельзя хранить пароль открытым текстом.

Правильно:

```txt
пароль пользователя -> bcrypt hash -> password_hash в базе
```

Также нельзя проверять роль только на клиенте.

Нужно проверять роль на сервере:

```txt
если role !== 'admin' -> не пускать в /admin
если role !== 'parent' -> не пускать в /cabinet
```

Клиентский интерфейс можно спрятать, но настоящая защита должна быть на сервере.
