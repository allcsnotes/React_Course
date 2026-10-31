import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/courses'

export default async function CoursePage({
  params,
}: PageProps<'/courses/[slug]'>) {
  const slug = params.slug
  const course = await getCourse(slug)
  if (!course) notFound()
  return (
    <article>
      <h1>{course.title}</h1>
      <p>By {course.teacher} · {course.lessonCount} lessons</p>
      <p className="price">
        {course.price === 0 ? 'Free' : `Rs ${course.price}`}
      </p>
    </article>
  )
}
