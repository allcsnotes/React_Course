const LEVELS = ['beginner', 'intermediate', 'advanced']

type Props = { value?: string; onChange: (level: string) => void }

export default function LevelPicker({ value, onChange }: Props) {
  return (
    <div className="picker">
      {LEVELS.map((level) => (
        <button
          type="button"
          key={level}
          className={level === value ? 'on' : ''}
          onClick={() => onChange(level)}
        >
          {level}
        </button>
      ))}
    </div>
  )
}
