'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { enrollments } from '@/db/schema'

export async function enroll(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  await db.insert(enrollments).values({
    userId: Number(session.user.id),
    course: String(formData.get('course')),
  })
  revalidatePath('/dashboard')
}
