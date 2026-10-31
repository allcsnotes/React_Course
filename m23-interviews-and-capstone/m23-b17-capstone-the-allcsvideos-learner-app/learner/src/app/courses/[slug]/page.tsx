import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import CourseProgress from '@/components/Progress'
import { getCourse } from '@/lib/api'

type Params = PageProps<'/courses/[slug]'>['params']

async function Course({ params }: { params: Params }) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()
  return (
    <article>
      <h1>{course.title}</h1>
      <p className="meta">{course.teacher} · {course.level}</p>
      <p>{course.summary}</p>
      <Suspense fallback={<p className="muted">Loading your progress…</p>}>
        <CourseProgress slug={slug} lessons={course.lessons} />
      </Suspense>
    </article>
  )
}

export default function CoursePage(props: PageProps<'/courses/[slug]'>) {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Course params={props.params} />
    </Suspense>
  )
}
