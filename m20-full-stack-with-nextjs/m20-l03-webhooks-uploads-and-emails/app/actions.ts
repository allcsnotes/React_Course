'use server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { orders } from '@/lib/schema'
import { createSession } from '@/lib/provider'

export async function buy() {
  const [order] = await db
    .insert(orders)
    .values({ course: 'React for Beginners', amount: 499 })
    .returning()
  const session = await createSession(order)
  redirect(session.url)
}
