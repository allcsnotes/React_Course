import { useState } from 'react'
import { Modal } from './Modal'

export function CourseCard({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="card"
      onClick={(e) =>
        console.log('card heard:', (e.target as HTMLElement).textContent)
      }
    >
      <h2>{title}</h2>
      <p>Teacher: Meera</p>
      <button onClick={() => setOpen(true)}>Cancel enrollment</button>
      {open && (
        <Modal>
          <h3>Cancel enrollment?</h3>
          <p>You will lose access to {title}.</p>
          <div className="row">
            <button className="ghost" onClick={() => setOpen(false)}>
              Keep
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
