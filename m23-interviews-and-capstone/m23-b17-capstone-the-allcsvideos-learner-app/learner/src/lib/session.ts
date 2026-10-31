import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

// Auth.js makes a random value: ask for request time first.
export async function getSession() {
  await connection()
  return auth()
}

export async function requireUser() {
  const session = await getSession()
  if (!session?.user) redirect('/login')
  return { id: session.user.id, name: session.user.name ?? '' }
}
