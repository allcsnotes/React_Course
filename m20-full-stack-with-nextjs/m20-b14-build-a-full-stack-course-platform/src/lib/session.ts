import { forbidden, redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function requireUser() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return {
    id: Number(session.user.id),
    name: session.user.name ?? '',
    role: session.user.role,
  }
}

export async function requireInstructor() {
  const user = await requireUser()
  if (user.role !== 'instructor') forbidden()
  return user
}
