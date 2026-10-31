import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCourses, getReviews } from '@/lib/api'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((c) => ({ slug: c.slug }))
}

async function Reviews({ slug }: { slug: string }) {
  const reviews = await getReviews(slug)
  return (
    <ul>
      {reviews.map((r) => (
        <li key={r.who}>
          {r.who}: {r.text}
        </li>
      ))}
    </ul>
  )
}

export default async function CoursePage({ params }: PageProps<'/courses/[slug]'>) {
  const { slug } = await params
  const course = (await getCourses()).find((c) => c.slug === slug)
  if (!course) notFound()
  return (
    <main>
      <h1>{course.title}</h1>
      <p>by {course.teacher}</p>
      <h2>Reviews</h2>
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews slug={slug} />
      </Suspense>
    </main>
  )
}
