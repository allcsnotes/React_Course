import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type Base = { variant?: Variant; size?: Size; children: ReactNode }

type ButtonProps = Base &
  (
    | { as?: 'button'; onClick: () => void; href?: never }
    | { as: 'link'; href: string; onClick?: never }
  )

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children } = props
  const cls = `btn ${variant} ${size}`
  if (props.as === 'link') {
    return <a className={cls} href={props.href}>{children}</a>
  }
  return <button className={cls} onClick={props.onClick}>{children}</button>
}
