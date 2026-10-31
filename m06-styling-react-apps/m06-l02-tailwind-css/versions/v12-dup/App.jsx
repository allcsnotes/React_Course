import courses from './data/courses.js'

export default function App() {
  const [a, b] = courses

  return (
    <main
      className="grid min-h-screen grid-cols-2
        content-start gap-2 bg-slate-100 p-2"
    >
      <article className="rounded-xl bg-white p-2.5 shadow-md">
        <h2 className="text-lg font-bold text-slate-900">
          {a.title}
        </h2>
        <p className="text-slate-500">by {a.teacher}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-bold text-slate-900">Rs {a.price}</p>
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
      <article className="rounded-xl bg-white p-2.5 shadow-md">
        <h2 className="text-lg font-bold text-slate-900">
          {b.title}
        </h2>
        <p className="text-slate-500">by {b.teacher}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-bold text-slate-900">Rs {b.price}</p>
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
    </main>
  )
}
