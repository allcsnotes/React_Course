import { Outlet, useLoaderData } from 'react-router'

export async function loader() {
  const res = await fetch('/api/me')
  return res.json()
}

export default function CoursesLayout() {
  const user = useLoaderData()

  return (
    <div>
      <h2>Courses for {user.name}</h2>
      <Outlet />
    </div>
  )
}
