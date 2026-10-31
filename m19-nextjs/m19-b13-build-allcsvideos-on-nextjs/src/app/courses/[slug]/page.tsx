import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getCourse, getCourses } from '@/lib/api'
import EnrollButton from '@/components/EnrollButton'
import Reviews from '@/components/Reviews'

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/courses/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) return { title: 'Course not found' }
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: {
      title: course.title,
      description: course.summary,
      images: [`/covers/${slug}.png`],
    },
  }
}

export default async function CoursePage({
  params,
}: PageProps<'/courses/[slug]'>) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.summary,
    provider: { '@type': 'Organization', name: 'allcsvideos' },
  }
  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="course-top">
        <Image
          src={`/covers/${slug}.png`}
          alt={`Cover of ${course.title}`}
          width={1280}
          height={720}
          sizes="(min-width: 760px) 480px, 50vw"
          priority
          className="hero-img"
        />
        <div>
          <h1>{course.title}</h1>
          <p className="meta">
            {course.teacher} · {course.level} · {course.lessonCount} lessons
          </p>
          <p>{course.summary}</p>
          <EnrollButton price={course.price} />
        </div>
      </div>
      <h2>Lessons</h2>
      <ol>
        {course.lessons.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ol>
      <h2>Reviews</h2>
      <Suspense fallback={<p className="muted">Loading reviews…</p>}>
        <Reviews slug={slug} />
      </Suspense>
    </article>
  )
}
