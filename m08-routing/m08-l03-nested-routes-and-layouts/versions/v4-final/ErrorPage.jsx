import { Link, useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="oops">
      <h2>Oops, something went wrong</h2>
      <p>{error.message}</p>
      <Link to="/catalog">Back to the catalog</Link>
    </div>
  )
}
