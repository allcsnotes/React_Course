import Link from 'next/link'

export default function CourseNotFound() {
  return (
    <div className="oops">
      <h2>No such course</h2>
      <Link href="/courses">Back to all courses</Link>
    </div>
  )
}
