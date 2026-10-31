import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main className="page">
      <h1>Page not found</h1>
      <p>There is nothing at this address.</p>
      <Link to="/">Go home</Link>
    </main>
  )
}
