export default function CourseCard({ course }) {
  const color = course.free ? 'green' : 'slate'

  return (
    <article className="rounded-xl bg-white p-2.5 shadow-md">
      <h2 className="text-lg font-bold text-slate-900">
        {course.title}
      </h2>
      <p className="text-slate-500">by {course.teacher}</p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1
            font-semibold bg-${color}-100
            text-${color}-700`}
        >
          {course.free ? 'Free' : `Rs ${course.price}`}
        </span>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-3 py-1.5
            font-semibold text-white
            hover:bg-blue-700"
        >
          Enroll
        </button>
      </div>
    </article>
  )
}
