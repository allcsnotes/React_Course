import { useState } from 'react'

type User = { name: string; plan: 'free' | 'pro' }

function UserCard({ user }: { user: User }) {
  return (
    <p>
      Signed in: {user.name} ({user.plan} plan)
    </p>
  )
}

// Sidebar does not use the user. It only hands it on.
function Sidebar({ user }: { user: User }) {
  return (
    <aside>
      <h3>Sidebar</h3>
      <UserCard user={user} />
    </aside>
  )
}

// Page does not use the user either. It only hands it on.
function Page({ user }: { user: User }) {
  return (
    <section>
      <h3>Page</h3>
      <Sidebar user={user} />
    </section>
  )
}

export default function Ex01() {
  const [user, setUser] = useState<User>({ name: 'Lukas', plan: 'free' })

  return (
    <div className="card">
      <Page user={user} />
      <button onClick={() => setUser({ name: 'Priya', plan: 'pro' })}>Switch to Priya</button>
    </div>
  )
}
