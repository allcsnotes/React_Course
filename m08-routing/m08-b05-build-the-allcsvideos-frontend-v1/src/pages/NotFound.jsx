import { Link, useLocation } from 'react-router'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <>
      <h1>404</h1>
      <p>No page lives at {pathname}</p>
      <Link to="/">Go to the home page</Link>
    </>
  )
}
