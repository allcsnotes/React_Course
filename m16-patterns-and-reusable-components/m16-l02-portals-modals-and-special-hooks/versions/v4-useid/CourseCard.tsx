import { useState } from 'react'
import { Modal } from './Modal'

export function CourseCard({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>Teacher: Meera</p>
      <button onClick={() => setOpen(true)}>Cancel enrollment</button>
      {open && (
        <Modal title="Cancel enrollment?" onClose={() => setOpen(false)}>
          <p>You will lose access to {title}.</p>
          <div className="row">
            <button className="ghost" onClick={() => setOpen(false)}>Keep</button>
            <button className="danger" onClick={() => setOpen(false)}>Yes, cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
