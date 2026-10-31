import type { ReactNode } from 'react'

type Props = {
  label: string
  error?: string
  children: ReactNode
}

export default function Field({
  label,
  error,
  children,
}: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <em className="err">{error}</em>}
    </label>
  )
}
