import courses from './data/courses.js'

export default function App() {
  const course = courses[0]

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <article
        className="mx-auto w-[340px] rounded-xl bg-white
          p-4 shadow-md"
      >
        <div className="flex items-center gap-3">
          <img
            src={course.image}
            alt=""
            className="h-12 w-12 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {course.title}
            </h2>
            <p className="text-slate-500">
              by {course.teacher} · {course.lessons} lessons
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">
            Rs {course.price}
          </p>
          <button
            type="button"
            className="rounded-lg bg-[#1a7cff] px-4 py-2
              font-semibold text-white
              hover:bg-[#0f63d6] focus:ring-4
              focus:ring-blue-300 focus:outline-none"
          >
            Enroll
          </button>
        </div>
      </article>
    </main>
  )
}
