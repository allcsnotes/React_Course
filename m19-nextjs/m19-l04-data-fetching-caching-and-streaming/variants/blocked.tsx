import { notFound } from 'next/navigation'
import { getCourses, getReviews } from '@/lib/api'

export const instant = false

export default async function BlockedPage({ params }: PageProps<'/blocked/[slug]'>) {
  const { slug } = await params
  const course = (await getCourses()).find((c) => c.slug === slug)
  if (!course) notFound()
  const reviews = await getReviews(slug)
  return (
    <main>
      <h1>{course.title}</h1>
      <p>by {course.teacher}</p>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r.who}>
            {r.who}: {r.text}
          </li>
        ))}
      </ul>
    </main>
  )
}
