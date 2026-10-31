import { useState } from 'react'
import { Button } from './Button.tsx'

export default function App() {
  const [seats, setSeats] = useState(0)
  return (
    <>
      <header><strong>allcsvideos · components</strong><span className="tag">demo</span></header>
      <main>
        <div className="panel">
          <h2>Priya's course page</h2>
          <div className="row">
            <div className="cell">
              <Button onClick={() => setSeats(seats + 1)}>Enroll</Button>
              <span className="cap">onClick</span>
            </div>
            <div className="cell">
              <Button as="link" href="#syllabus" variant="secondary">Syllabus</Button>
              <span className="cap">as="link" href</span>
            </div>
          </div>
          <p className="msg">Seats taken: {seats}</p>
        </div>
      </main>
    </>
  )
}
