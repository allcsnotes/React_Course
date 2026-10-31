import type { ReactNode } from 'react'

type Props = {
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export function Card({ header, footer, children }: Props) {
  return (
    <section className="box">
      <div className="box-head">{header}</div>
      <div className="box-body">{children}</div>
      {footer && <div className="box-foot">{footer}</div>}
    </section>
  )
}
