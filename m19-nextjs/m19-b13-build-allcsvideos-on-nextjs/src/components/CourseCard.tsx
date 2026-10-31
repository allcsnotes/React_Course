import Image from 'next/image'
import Link from 'next/link'
import type { Course } from '@/lib/api'

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="card">
      <Image
        src={`/covers/${course.slug}.png`}
        alt={`Cover of ${course.title}`}
        width={640}
        height={360}
        sizes="(min-width: 1000px) 320px, 33vw"
      />
      <div className="card-body">
        <h3>{course.title}</h3>
        <p>
          {course.teacher} · {course.level}
        </p>
        <span className="price">
          {course.free ? 'Free' : `Rs ${course.price}`}
        </span>
      </div>
    </Link>
  )
}
