import Link from 'next/link'
import { getSession } from '@/lib/session'
import { logout } from '@/app/actions'

export default async function UserMenu() {
  const session = await getSession()
  if (!session?.user) return <Link href="/login">Sign in</Link>
  return (
    <>
      <Link href="/my">My learning</Link>
      <form action={logout}>
        <button className="link">Sign out ({session.user.name})</button>
      </form>
    </>
  )
}
