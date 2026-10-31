type Props = { done: number; total: number }

export default function ProgressBar({ done, total }: Props) {
  const percent = Math.round((done / total) * 100)
  return (
    <div>
      <div className="track">
        <div
          className={percent === 100 ? 'fill full' : 'fill'}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p>
        {done} of {total} lessons · {percent}%
      </p>
    </div>
  )
}
