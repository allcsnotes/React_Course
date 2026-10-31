import { useEffect, useState } from 'react'
import { getCourses, type Course } from './api'
import { useCart } from './CartContext'
import CourseCard from './CourseCard'

export default function Catalog() {
  const [courses, setCourses] = useState<Course[] | null>(null)
  const { items, add } = useCart()

  useEffect(() => {
    getCourses().then(setCourses)
  }, [])

  if (!courses) return <p>Loading courses…</p>
  return (
    <>
      <h1>Courses</h1>
      <ul className="list">
        {courses.map(c => (
          <CourseCard key={c.slug} course={c} inCart={items.some(i => i.slug === c.slug)} onAdd={add} />
        ))}
      </ul>
    </>
  )
}
