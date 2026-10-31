import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
}: ButtonProps) {
  return <button className={`btn ${variant} ${size}`}>{children}</button>
}
