import { useState } from 'react'
import { courses } from '../courses'

export default function Ex18() {
  const [filter, setFilter] = useState('all')

  let shown = courses
  if (filter === 'free') shown = courses.filter((c) => c.free)
  if (filter === 'paid') shown = courses.filter((c) => !c.free)

  return (
    <div>
      <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
        All
      </button>
      <button className={filter === 'free' ? 'on' : ''} onClick={() => setFilter('free')}>
        Free
      </button>
      <button className={filter === 'paid' ? 'on' : ''} onClick={() => setFilter('paid')}>
        Paid
      </button>
      <p>{shown.length} courses shown</p>
      {shown.map((c) => (
        <div key={c.id} className="card">
          <h3>{c.title}</h3>
          <p>
            {c.teacher} · {c.free ? 'Free' : 'Rs ' + c.price}
          </p>
        </div>
      ))}
    </div>
  )
}
