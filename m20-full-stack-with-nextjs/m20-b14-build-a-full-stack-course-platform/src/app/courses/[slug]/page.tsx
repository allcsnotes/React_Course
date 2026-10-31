import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Lessons from '@/components/Lessons'
import { getCourse, getSlugs } from '@/lib/courses'

export async function generateStaticParams() {
  return (await getSlugs()).map((slug) => ({ slug }))
}

export default async function CoursePage({
  params,
}: PageProps<'/courses/[slug]'>) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()
  return (
    <article>
      <h1>{course.title}</h1>
      <p className="meta">
        {course.teacher} · {course.level}
      </p>
      <p>{course.summary}</p>
      <Suspense fallback={<p className="muted">Loading your progress…</p>}>
        <Lessons courseId={course.id} lessons={course.lessons} />
      </Suspense>
    </article>
  )
}
