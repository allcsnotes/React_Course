import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="center">
      <h1>This course does not exist</h1>
      <p>Maybe it was renamed. Try the full list.</p>
      <Link className="btn" href="/courses">
        All courses
      </Link>
    </div>
  )
}
