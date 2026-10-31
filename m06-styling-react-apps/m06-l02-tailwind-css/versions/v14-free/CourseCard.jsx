export default function CourseCard({ course }) {
  return (
    <article className="rounded-xl bg-white p-2.5 shadow-md">
      <h2 className="text-lg font-bold text-slate-900">
        {course.title}
      </h2>
      <p className="text-slate-500">by {course.teacher}</p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1
            font-semibold ${
              course.free
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-700'
            }`}
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
