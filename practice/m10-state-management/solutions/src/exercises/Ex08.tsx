import { createContext, useContext, useState, type ReactNode } from 'react'
import { courses } from '../data.ts'

type User = { name: string }
type UserValue = { user: User | null; login: () => void; logout: () => void }

const UserContext = createContext<UserValue | null>(null)

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return <UserContext value={{ user, login, logout }}>{children}</UserContext>
}

function useUser(): UserValue {
  const value = useContext(UserContext)
  if (value === null) throw new Error('useUser must be used inside UserProvider')
  return value
}

function UserMenu() {
  const { user, login, logout } = useUser()
  return user === null ? (
    <button onClick={login}>Log in</button>
  ) : (
    <span>
      Hello, {user.name} <button onClick={logout}>Log out</button>
    </span>
  )
}

// Four levels below the provider, and nobody passes it a prop.
function EnrollButton({ title }: { title: string }) {
  const { user } = useUser()
  return (
    <button disabled={user === null}>
      {user === null ? 'Log in to enroll' : 'Enroll'} · {title}
    </button>
  )
}

function CourseCard({ title }: { title: string }) {
  return (
    <div className="card">
      <EnrollButton title={title} />
    </div>
  )
}

function CourseList() {
  return (
    <>
      {courses.slice(0, 3).map((c) => (
        <CourseCard key={c.id} title={c.title} />
      ))}
    </>
  )
}

export default function Ex08() {
  return (
    <UserProvider>
      <UserMenu />
      <CourseList />
    </UserProvider>
  )
}
