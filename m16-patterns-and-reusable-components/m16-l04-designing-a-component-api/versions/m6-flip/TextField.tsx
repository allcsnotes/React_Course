type TextFieldProps = {
  label: string
  value?: string
  onChange: (next: string) => void
}

export function TextField({ label, value, onChange }: TextFieldProps) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
