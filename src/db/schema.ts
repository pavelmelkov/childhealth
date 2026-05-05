import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'parent']);
export const slotStatusEnum = pgEnum('slot_status', ['available', 'booked', 'blocked']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled']);
export const postTypeEnum = pgEnum('post_type', ['news', 'progress', 'homework']);
export const postAudienceEnum = pgEnum('post_audience', ['all', 'parent', 'child']);
export const scheduleExceptionTypeEnum = pgEnum('schedule_exception_type', [
  'closed_day',
  'closed_interval',
  'open_interval',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').default('parent').notNull(),
    fullName: varchar('full_name', { length: 160 }).notNull(),
    phone: varchar('phone', { length: 32 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    uniqueIndex('users_phone_unique').on(table.phone),
  ],
);

export const children = pgTable(
  'children',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    parentId: uuid('parent_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 120 }).notNull(),
    age: varchar('age', { length: 32 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('children_parent_id_idx').on(table.parentId)],
);

export const calendarSlots = pgTable(
  'calendar_slots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    status: slotStatusEnum('status').default('available').notNull(),
    adminNote: text('admin_note'),
    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('calendar_slots_starts_at_idx').on(table.startsAt),
    index('calendar_slots_status_idx').on(table.status),
  ],
);

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slotId: uuid('slot_id')
      .notNull()
      .references(() => calendarSlots.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    childId: uuid('child_id')
      .notNull()
      .references(() => children.id, { onDelete: 'cascade' }),
    status: bookingStatusEnum('status').default('pending').notNull(),
    parentComment: text('parent_comment'),
    adminComment: text('admin_comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('bookings_slot_id_unique').on(table.slotId),
    index('bookings_parent_id_idx').on(table.parentId),
    index('bookings_child_id_idx').on(table.childId),
    index('bookings_status_idx').on(table.status),
  ],
);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 180 }).notNull(),
    content: text('content').notNull(),
    type: postTypeEnum('type').default('news').notNull(),
    audience: postAudienceEnum('audience').default('all').notNull(),
    parentId: uuid('parent_id').references(() => users.id, { onDelete: 'cascade' }),
    childId: uuid('child_id').references(() => children.id, { onDelete: 'cascade' }),
    createdById: uuid('created_by_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('posts_type_idx').on(table.type),
    index('posts_audience_idx').on(table.audience),
    index('posts_parent_id_idx').on(table.parentId),
    index('posts_child_id_idx').on(table.childId),
    index('posts_published_at_idx').on(table.publishedAt),
  ],
);

export const postReads = pgTable(
  'post_reads',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    parentId: uuid('parent_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    readAt: timestamp('read_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('post_reads_post_parent_unique').on(table.postId, table.parentId),
    index('post_reads_parent_id_idx').on(table.parentId),
  ],
);

export const scheduleSettings = pgTable(
  'schedule_settings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    singletonKey: varchar('singleton_key', { length: 32 }).default('default').notNull(),
    slotDurationMinutes: integer('slot_duration_minutes').default(60).notNull(),
    bookingHorizonDays: integer('booking_horizon_days').default(30).notNull(),
    minNoticeHours: integer('min_notice_hours').default(12).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('schedule_settings_singleton_key_unique').on(table.singletonKey)],
);

export const weeklyWorkingHours = pgTable(
  'weekly_working_hours',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    weekday: integer('weekday').notNull(),
    isEnabled: boolean('is_enabled').default(true).notNull(),
    startsAt: varchar('starts_at', { length: 5 }).default('09:00').notNull(),
    endsAt: varchar('ends_at', { length: 5 }).default('19:00').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('weekly_working_hours_weekday_unique').on(table.weekday)],
);

export const scheduleExceptions = pgTable(
  'schedule_exceptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    date: varchar('date', { length: 10 }).notNull(),
    type: scheduleExceptionTypeEnum('type').notNull(),
    startsAt: varchar('starts_at', { length: 5 }),
    endsAt: varchar('ends_at', { length: 5 }),
    note: text('note'),
    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('schedule_exceptions_date_idx').on(table.date),
    index('schedule_exceptions_type_idx').on(table.type),
  ],
);

export const pushSubscriptions = pgTable(
  'push_subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    endpoint: text('endpoint').notNull(),
    p256dh: text('p256dh').notNull(),
    auth: text('auth').notNull(),
    expirationTime: timestamp('expiration_time', { withTimezone: true }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('push_subscriptions_endpoint_unique').on(table.endpoint),
    index('push_subscriptions_user_id_idx').on(table.userId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  children: many(children),
  bookings: many(bookings),
  authoredSlots: many(calendarSlots),
  authoredPosts: many(posts),
  readPosts: many(postReads),
  pushSubscriptions: many(pushSubscriptions),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(users, {
    fields: [children.parentId],
    references: [users.id],
  }),
  bookings: many(bookings),
  posts: many(posts),
}));

export const calendarSlotsRelations = relations(calendarSlots, ({ one }) => ({
  createdBy: one(users, {
    fields: [calendarSlots.createdById],
    references: [users.id],
  }),
  booking: one(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  slot: one(calendarSlots, {
    fields: [bookings.slotId],
    references: [calendarSlots.id],
  }),
  parent: one(users, {
    fields: [bookings.parentId],
    references: [users.id],
  }),
  child: one(children, {
    fields: [bookings.childId],
    references: [children.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [posts.createdById],
    references: [users.id],
  }),
  parent: one(users, {
    fields: [posts.parentId],
    references: [users.id],
  }),
  child: one(children, {
    fields: [posts.childId],
    references: [children.id],
  }),
  reads: many(postReads),
}));

export const postReadsRelations = relations(postReads, ({ one }) => ({
  post: one(posts, {
    fields: [postReads.postId],
    references: [posts.id],
  }),
  parent: one(users, {
    fields: [postReads.parentId],
    references: [users.id],
  }),
}));

export const scheduleExceptionsRelations = relations(scheduleExceptions, ({ one }) => ({
  createdBy: one(users, {
    fields: [scheduleExceptions.createdById],
    references: [users.id],
  }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [pushSubscriptions.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Child = typeof children.$inferSelect;
export type CalendarSlot = typeof calendarSlots.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type ScheduleSettings = typeof scheduleSettings.$inferSelect;
export type WeeklyWorkingHours = typeof weeklyWorkingHours.$inferSelect;
export type ScheduleException = typeof scheduleExceptions.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
