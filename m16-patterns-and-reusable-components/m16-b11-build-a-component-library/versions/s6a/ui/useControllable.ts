import { useState } from 'react'

export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [inner, setInner] = useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner
  function set(next: T) {
    if (!controlled) setInner(next)
    onChange?.(next)
  }
  return [current, set] as const
}
