import { useRef } from 'react'

const LEVELS = ['beginner', 'intermediate', 'advanced']

type Props = { value?: string; onChange: (level: string) => void }

export default function LevelPicker({ value, onChange }: Props) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="picker">
      {LEVELS.map((level) => (
        <button
          key={level}
          className={level === value ? 'on' : ''}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
      <span className="count">picker renders: {renders.current}</span>
    </div>
  )
}
