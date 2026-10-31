import {
  Link,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()
  const missing =
    isRouteErrorResponse(error) && error.status === 404

  return (
    <>
      <h1>
        {missing
          ? 'Course not found'
          : 'Something went wrong'}
      </h1>
      <p>
        {missing
          ? 'There is no course at this address.'
          : error.message}
      </p>
      <Link to="/catalog">Back to the catalog</Link>
    </>
  )
}
