'use server';

import { hash } from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin } from '@/auth/guards';
import { db } from '@/db';
import { children, users } from '@/db/schema';

const passwordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

const createParentSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value.toLowerCase() : null))
    .pipe(z.string().email().nullable()),
  phone: z.string().trim().min(5),
  password: passwordSchema,
  childName: z.string().trim().min(2),
  childAge: z.string().trim().min(1),
  childNotes: z.string().trim().optional(),
});

export async function createParentWithChild(formData: FormData) {
  await requireAdmin();

  const parsed = createParentSchema.safeParse({
    fullName: formData.get('fullName'),
    email: String(formData.get('email') ?? '') || undefined,
    phone: formData.get('phone'),
    password: formData.get('password'),
    childName: formData.get('childName'),
    childAge: formData.get('childAge'),
    childNotes: formData.get('childNotes'),
  });

  if (!parsed.success) {
    redirect('/admin/parents?error=invalid');
  }

  const data = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: data.email
      ? or(eq(users.email, data.email), eq(users.phone, data.phone))
      : eq(users.phone, data.phone),
  });

  if (existingUser?.email && data.email && existingUser.email === data.email) {
    redirect('/admin/parents?error=email');
  }

  if (existingUser?.phone === data.phone) {
    redirect('/admin/parents?error=phone');
  }

  const passwordHash = await hash(data.password, 12);

  await db.transaction(async (tx) => {
    const [parent] = await tx
      .insert(users)
      .values({
        email: data.email,
        passwordHash,
        role: 'parent',
        fullName: data.fullName,
        phone: data.phone,
      })
      .returning({ id: users.id });

    await tx.insert(children).values({
      parentId: parent.id,
      name: data.childName,
      age: data.childAge,
      notes: data.childNotes || null,
    });
  });

  redirect('/admin/parents?created=1');
}
