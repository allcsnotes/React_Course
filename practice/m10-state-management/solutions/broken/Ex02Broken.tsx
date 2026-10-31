import { useState } from 'react'

type User = { name: string; plan: 'free' | 'pro' }

function UserCard({ user }: { user: User }) {
  return (
    <p>
      Signed in: {user.name} ({user.plan} plan)
    </p>
  )
}

function Sidebar({ user }: { user: User }) {
  return (
    <aside>
      <UserCard /> {/* BUG: the user is not handed down */}
      <small>Sidebar for {user.name}</small>
    </aside>
  )
}

export default function Ex02Broken() {
  const [user] = useState<User>({ name: 'Lukas', plan: 'free' })
  return <Sidebar user={user} />
}
