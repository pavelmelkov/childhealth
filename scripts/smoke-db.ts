import { desc, eq } from 'drizzle-orm';
import { existsSync, readFileSync } from 'node:fs';

if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/^"|"$/g, '');

    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const { db } = await import('../src/db/index');
const { calendarSlots, users } = await import('../src/db/schema');

const parents = await db.query.users.findMany({
  where: eq(users.role, 'parent'),
  with: {
    children: true,
  },
});

const slots = await db.query.calendarSlots.findMany({
  orderBy: desc(calendarSlots.startsAt),
  limit: 5,
});

console.log({ parents: parents.length, slots: slots.length });
process.exit(0);
