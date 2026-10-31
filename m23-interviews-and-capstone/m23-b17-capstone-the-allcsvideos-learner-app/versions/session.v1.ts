import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function requireUser() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return { id: session.user.id, name: session.user.name ?? '' }
}
