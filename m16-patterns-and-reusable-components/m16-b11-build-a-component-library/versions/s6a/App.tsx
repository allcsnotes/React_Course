import { useEffect, useState } from 'react'
import { Dropdown, Modal, Tabs, ToastProvider, useToast } from './ui'

type Row = [name: string, type: string, note: string]

function Props({ rows }: { rows: Row[] }) {
  return (
    <table>
      <thead>
        <tr><th>Prop</th><th>Type</th><th>What it does</th></tr>
      </thead>
      <tbody>
        {rows.map(([name, type, note]) => (
          <tr key={name}><td><code>{name}</code></td><td><code>{type}</code></td><td>{note}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

function TabsDemo() {
  return (
    <>
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
    <Props rows={[
        ['value', 'string', 'open tab, you own it'],
        ['defaultValue', 'string', 'open tab at the start'],
        ['onValueChange', '(v) => void', 'tab was chosen'],
    ]} />
    </>
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
      <Props rows={[
        ['open', 'boolean', 'show or hide'],
        ['onClose', '() => void', 'Escape, backdrop, ×'],
        ['title', 'string', 'heading and name'],
      ]} />
    </>
  )
}

function DropdownDemo() {
  const [picked, setPicked] = useState('nothing yet')
  return (
    <>
      <Dropdown
        label="Actions"
        items={[
          { id: 'rename', label: 'Rename' },
          { id: 'duplicate', label: 'Duplicate' },
          { id: 'archive', label: 'Archive' },
        ]}
        onSelect={setPicked}
      />
      <p>Picked: {picked}</p>
      <Props rows={[
        ['label', 'string', 'text on the button'],
        ['items', 'DropdownItem[]', 'id + label each'],
        ['onSelect', '(id) => void', 'an item was chosen'],
      ]} />
    </>
  )
}

function ToastDemo() {
  const toast = useToast()
  return (
    <>
      <button onClick={() => toast('Saved your changes')}>Save</button>
      <Props rows={[
        ['seconds', 'number', 'how long a toast stays'],
        ['useToast()', '(text) => void', 'show a toast'],
      ]} />
    </>
  )
}

const demos: Record<string, () => React.JSX.Element> = {
  tabs: TabsDemo,
  modal: ModalDemo,
  dropdown: DropdownDemo,
  toast: ToastDemo,
}

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
      <ToastProvider>
        <Demo />
      </ToastProvider>
    </div>
  )
}
