import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import CourseCard from './CourseCard'
import Panel from './Panel'
import courses from './courses'

export default function App() {
  const [enrolled, setEnrolled] = useState<number[]>([])
  const [query, setQuery] = useState('')
  const [coupon, setCoupon] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const couponRef = useRef<HTMLInputElement>(null)

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  function handleEnroll(id: number) {
    setEnrolled([...enrolled, id])
  }

  function handleCoupon(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (coupon === '') {
      setMessage('Type a code first')
      couponRef.current?.focus()
      return
    }
    setMessage(`Code ${coupon} applied`)
  }

  const shown = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="page">
      <header>
        <b className="logo">allcsvideos</b>
        <span>Enrolled: {enrolled.length}</span>
      </header>
      <div className="tools">
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search courses"
        />
        <form onSubmit={handleCoupon}>
          <input
            ref={couponRef}
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
          />
          <button>Apply</button>
        </form>
      </div>
      <p className="msg">{message.toUpperCase()}</p>
      <Panel title="Courses">
        <div className="grid">
          {shown.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              level={c.lessons > 15 ? 'advanced' : 'beginner'}
              badge={c.free ? 'Free' : undefined}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      </Panel>
    </main>
  )
}
