import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

export default function CoursesLayout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(setUser)
  }, [])

  if (user === null) return <p className="note">Loading…</p>

  return (
    <div>
      <h2>Courses for {user.name}</h2>
      <Outlet />
    </div>
  )
}
