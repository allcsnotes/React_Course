const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
]

export default function Filters({
  current,
  onChange,
}) {
  return (
    <div className="filters">
      {FILTERS.map(f => (
        <button
          key={f.id}
          className={f.id === current ? 'on' : ''}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
