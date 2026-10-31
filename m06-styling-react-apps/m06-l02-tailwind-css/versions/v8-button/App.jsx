import courses from './data/courses.js'

export default function App() {
  const course = courses[0]

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <article className="rounded-xl bg-white p-4 shadow-md">
        <h2 className="text-xl font-bold text-slate-900">
          {course.title}
        </h2>
        <p className="text-slate-500">
          by {course.teacher} · {course.lessons} lessons
        </p>
        <p className="text-lg font-bold text-slate-900">
          Rs {course.price}
        </p>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2
            font-semibold text-white"
        >
          Enroll
        </button>
      </article>
    </main>
  )
}
