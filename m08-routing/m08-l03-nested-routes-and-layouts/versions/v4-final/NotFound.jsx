import { Link } from 'react-router'

export default function NotFound() {
  return (
    <>
      <h2>Page not found</h2>
      <p>There is nothing at this address.</p>
      <Link className="btn" to="/">Go home</Link>
    </>
  )
}
