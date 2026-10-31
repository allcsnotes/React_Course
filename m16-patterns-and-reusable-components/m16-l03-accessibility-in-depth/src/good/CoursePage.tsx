import { useState } from 'react'
import { Dialog } from './Dialog'
import { Tabs } from './Tabs'
import { Wish } from './Wish'

export default function CoursePage() {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  function close(yes: boolean) {
    setOpen(false)
    if (yes) setMsg('Enrolled in Python from Zero')
  }
  return (
    <>
      <main className="page" inert={open}>
        <h1>Python from Zero</h1>
        <p className="by">by Meera · 40 lessons</p>
        <div className="row">
          <button onClick={() => setOpen(true)}>Enroll</button>
          <Wish say={setMsg} />
        </div>
        <Tabs />
        <div role="status" className="toast">{msg}</div>
      </main>
      {open && <Dialog onClose={close} />}
    </>
  )
}
