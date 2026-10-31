import { forwardRef } from 'react'

export const Field = forwardRef<HTMLInputElement, { label: string }>(
  function Field({ label }, ref) {
    return (
      <label>
        {label}
        <input ref={ref} name="email" />
      </label>
    )
  },
)
