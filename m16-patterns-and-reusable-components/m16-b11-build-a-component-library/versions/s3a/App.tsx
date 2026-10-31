import { useEffect, useState } from 'react'
import { Modal } from './ui/Modal'
import { Tabs } from './ui/Tabs'

function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <Tabs.List label="Course sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
        <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Learn React from zero.</Tabs.Panel>
      <Tabs.Panel value="lessons">97 lessons and 17 builds.</Tabs.Panel>
      <Tabs.Panel value="reviews">Rated 4.9 by students.</Tabs.Panel>
    </Tabs>
  )
}

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete course</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete this course?">
        <p>Its 97 lessons will be removed. This cannot be undone.</p>
        <div className="row">
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => setOpen(false)}>Delete</button>
        </div>
      </Modal>
    </>
  )
}

const demos: Record<string, () => React.JSX.Element> = { tabs: TabsDemo, modal: ModalDemo }

export default function App() {
  const [hash, setHash] = useState(location.hash.slice(1))
  useEffect(() => {
    const on = () => setHash(location.hash.slice(1))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const page = hash in demos ? hash : 'tabs'
  const Demo = demos[page]
  return (
    <div className="page">
      <h1>Tiny UI</h1>
      <nav className="nav">
        {Object.keys(demos).map(k => (
          <a key={k} href={`#${k}`} aria-current={k === page ? 'page' : undefined}>{k}</a>
        ))}
      </nav>
      <Demo />
    </div>
  )
}
