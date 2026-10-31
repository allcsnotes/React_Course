import { useState } from 'react'

export default function Ex12() {
  const [student, setStudent] = useState({ name: 'Lukas', city: 'Pune', points: 0 })

  return (
    <div className="card">
      <h3>{student.name}</h3>
      <p>
        City: {student.city} · Points: {student.points}
      </p>
      <button onClick={() => setStudent({ ...student, points: student.points + 10 })}>+10 points</button>
      <button onClick={() => setStudent({ ...student, city: 'Delhi' })}>Move to Delhi</button>
      <button onClick={() => setStudent({ ...student, name: 'Lukas Rao' })}>Add surname</button>
    </div>
  )
}
