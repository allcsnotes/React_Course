import { percent } from '@/lib/progress'

export default function Progress({ done, total }: { done: number; total: number }) {
  const p = percent(done, total)
  return (
    <div className="bar" aria-label={`${p}% done`}>
      <div className="fill" style={{ width: `${p}%` }} />
      <span>{done}/{total} lessons · {p}%</span>
    </div>
  )
}
