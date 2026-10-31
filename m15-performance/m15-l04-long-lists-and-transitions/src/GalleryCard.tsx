import type { Course } from './data'

export default function GalleryCard({ course }: { course: Course }) {
  return (
    <article className="gcard">
      <div className="thumb" />
      <h3>{course.title}</h3>
      <div className="meta">
        <span>{course.hours} h</span>
        <span className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <i key={n}>{n <= course.rating ? '★' : '☆'}</i>
          ))}
        </span>
      </div>
    </article>
  )
}
