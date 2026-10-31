type Props = {
  page: number
  total: number
  onGo: (page: number) => void
  busy?: boolean
  onPeek?: () => void
}

export default function Pager({
  page, total, onGo, busy, onPeek,
}: Props) {
  return (
    <div className="pager">
      <button
        onClick={() => onGo(page - 1)}
        disabled={page === 1}
      >Previous</button>
      <span>Page {page} of {total}</span>
      <button
        onClick={() => onGo(page + 1)}
        onMouseEnter={onPeek}
        disabled={busy || page === total}
      >Next</button>
    </div>
  )
}
