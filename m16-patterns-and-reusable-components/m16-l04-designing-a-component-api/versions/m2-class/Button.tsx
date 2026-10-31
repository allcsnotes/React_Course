import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant
  size?: Size
}

export function Button({
  variant = 'primary',
  size = 'md',
  ...rest
}: ButtonProps) {
  const cls = `btn ${variant} ${size}`
  return <button className={cls} {...rest} />
}
