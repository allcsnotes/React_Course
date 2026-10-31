import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { courses, findCourse } from '@/lib/courses'

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/courses/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const course = findCourse(slug)
  if (!course) return { title: 'Course not found' }
  return {
    title: course.title,
    description: course.blurb,
    openGraph: {
      title: course.title,
      description: course.blurb,
      type: 'website',
    },
  }
}

export default async function CoursePage({ params }: PageProps<'/courses/[slug]'>) {
  const { slug } = await params
  const course = findCourse(slug)
  if (!course) notFound()
  return (
    <main>
      <h1>{course.title}</h1>
      <p>{course.blurb}</p>
      <p>Rs {course.price}</p>
    </main>
  )
}
