import type { ReactNode } from 'react'
import { useDisclosure } from './useDisclosure'

type Props = { question: string; children: ReactNode }

export function FaqItem({ question, children }: Props) {
  const { open, buttonProps } = useDisclosure()
  return (
    <div className="faq">
      <button className="faq-q" {...buttonProps}>
        {question} <span>{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-a">{children}</p>}
    </div>
  )
}
