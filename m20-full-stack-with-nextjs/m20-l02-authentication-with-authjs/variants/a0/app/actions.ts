'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { enrollments } from '@/db/schema'

export async function enroll(formData: FormData) {
  await db.insert(enrollments).values({
    userId: Number(formData.get('userId')),
    course: String(formData.get('course')),
  })
  revalidatePath('/dashboard')
}
