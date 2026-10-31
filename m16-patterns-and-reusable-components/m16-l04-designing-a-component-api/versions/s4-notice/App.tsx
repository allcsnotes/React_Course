import { useState } from 'react'
import { Notice } from './Notice.tsx'

export default function App() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <header><strong>allcsvideos · components</strong><span className="tag">demo</span></header>
      <main>
        <div className="panel">
          <h2>Priya's course page</h2>
          <div className="row" style={{ flexDirection: 'column' }}>
            <Notice>Classes start on Monday.</Notice>
            {open && (
              <Notice tone="warning" dismissible onDismiss={() => setOpen(false)}>
                Only 3 seats left.
              </Notice>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
