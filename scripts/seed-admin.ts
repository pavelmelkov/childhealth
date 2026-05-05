import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
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
const { users } = await import('../src/db/schema');

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin12345';
const adminName = process.env.SEED_ADMIN_NAME ?? 'Администратор';

const existingAdmin = await db.query.users.findFirst({
  where: eq(users.email, adminEmail.toLowerCase()),
});

if (existingAdmin) {
  console.log(`Admin already exists: ${adminEmail}`);
  process.exit(0);
}

const passwordHash = await hash(adminPassword, 12);

await db.insert(users).values({
  email: adminEmail.toLowerCase(),
  passwordHash,
  role: 'admin',
  fullName: adminName,
});

console.log('Admin created');
console.log(`Email: ${adminEmail}`);
console.log(`Password: ${adminPassword}`);
process.exit(0);
