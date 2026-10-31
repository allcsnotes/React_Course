import type { ReactNode } from 'react'

type ButtonProps = {
  primary?: boolean
  secondary?: boolean
  danger?: boolean
  small?: boolean
  large?: boolean
  children: ReactNode
}

export function Button({
  primary,
  secondary,
  danger,
  small,
  large,
  children,
}: ButtonProps) {
  let cls = 'btn'
  if (primary) cls += ' primary'
  if (secondary) cls += ' secondary'
  if (danger) cls += ' danger'
  if (small) cls += ' small'
  if (large) cls += ' large'
  return <button className={cls}>{children}</button>
}
