import Link from 'next/link'
import { auth } from '@/auth'
import { logout } from '@/app/actions'

export default async function UserMenu() {
  const session = await auth()
  if (!session?.user) return <Link href="/login">Sign in</Link>
  return (
    <>
      <Link href="/my">My courses</Link>
      {session.user.role === 'instructor' && (
        <Link href="/instructor">Dashboard</Link>
      )}
      <form action={logout}>
        <button className="link">Sign out ({session.user.name})</button>
      </form>
    </>
  )
}
