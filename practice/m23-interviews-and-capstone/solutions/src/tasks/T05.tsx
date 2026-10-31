import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

type Tab = { id: string; label: string; content: ReactNode }

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [selected, setSelected] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  if (tabs.length === 0) return <p className="muted">Nothing to show</p>

  function onKeyDown(e: KeyboardEvent, i: number) {
    const last = tabs.length - 1
    const to: Record<string, number> = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }
    if (!(e.key in to)) return
    e.preventDefault()
    setSelected(to[e.key]) // automatic activation: moving focus also opens the panel
    refs.current[to[e.key]]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Course sections">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === selected}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === selected ? 0 : -1}
            ref={(el) => { refs.current[i] = el }}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={i !== selected} tabIndex={0}>
          {t.content}
        </div>
      ))}
    </div>
  )
}

export default function T05() {
  return (
    <Tabs
      tabs={[
        { id: 'overview', label: 'Overview', content: <p>Overview: 12 lessons, 3 hours.</p> },
        { id: 'lessons', label: 'Lessons', content: <p>Lessons: start with What React Is.</p> },
        { id: 'reviews', label: 'Reviews', content: <p>Reviews: 4.8 out of 5.</p> },
      ]}
    />
  )
}
