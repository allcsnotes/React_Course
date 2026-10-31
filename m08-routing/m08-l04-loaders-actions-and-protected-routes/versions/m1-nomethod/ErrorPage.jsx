import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()
  return (
    <div>
      <h2>Something went wrong</h2>
      <p className="err">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.data}`
          : 'Unexpected error'}
      </p>
    </div>
  )
}
