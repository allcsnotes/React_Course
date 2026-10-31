import { useRef, useState } from 'react'

export default function StarRating({ max = 5 }) {
  const [value, setValue] = useState(0)
  const [hover, setHover] = useState(0)
  const refs = useRef([])

  function onKeyDown(e, i) {
    const to = { ArrowRight: i + 1, ArrowUp: i + 1, ArrowLeft: i - 1,
      ArrowDown: i - 1, Home: 1, End: max }[e.key]
    if (to === undefined) return
    e.preventDefault()
    const next = Math.min(max, Math.max(1, to))
    setValue(next)
    refs.current[next - 1].focus()
  }

  const shown = hover || value
  const stars = Array.from({ length: max }, (_, k) => k + 1)

  return (
    <div className="stars" role="radiogroup"
      aria-label="Course rating" onMouseLeave={() => setHover(0)}>
      {stars.map(i => (
        <button key={i} type="button" role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          tabIndex={value === i || (!value && i === 1) ? 0 : -1}
          ref={el => (refs.current[i - 1] = el)}
          className={i <= shown ? 'star on' : 'star'}
          onClick={() => setValue(i === value ? 0 : i)}
          onMouseEnter={() => setHover(i)}
          onKeyDown={e => onKeyDown(e, i)}>
          ★
        </button>
      ))}
    </div>
  )
}
