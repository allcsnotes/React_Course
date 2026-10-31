import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { API, type CourseData } from './types.ts'

export default function Course() {
  const { slug } = useParams()
  const [course, setCourse] = useState<CourseData | null>(null)

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((all: CourseData[]) => setCourse(all.find((c) => c.slug === slug) ?? null))
  }, [slug])

  return (
    <>
      <header className="top">
        <span className="logo">allcsvideos</span>
        <Link to="/">Courses</Link>
      </header>
      <main>
        {course && (
          <>
            <h1>{course.title}</h1>
            <p>
              {course.teacher} · {course.level} · {course.rating} stars
            </p>
          </>
        )}
        <Link className="back" to="/">
          Back to courses
        </Link>
      </main>
    </>
  )
}
