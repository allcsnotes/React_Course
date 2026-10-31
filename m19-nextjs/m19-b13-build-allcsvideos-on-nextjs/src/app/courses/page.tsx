import type { Metadata } from 'next'
import { getCourses } from '@/lib/api'
import CourseList from '@/components/CourseList'

export const metadata: Metadata = {
  title: 'All courses',
  description: 'Every allcsvideos course, from free starters to system design.',
}

export default async function CoursesPage() {
  const courses = await getCourses()
  return (
    <>
      <h1>All courses</h1>
      <CourseList courses={courses} />
    </>
  )
}
