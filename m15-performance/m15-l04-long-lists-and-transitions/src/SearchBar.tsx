type Props = { value: string; onChange: (value: string) => void; count?: number }

export default function SearchBar({ value, onChange, count }: Props) {
  return (
    <header className="top">
      <span className="logo">allcsvideos</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search courses" />
      {count !== undefined && <span className="count">{count} courses</span>}
    </header>
  )
}
