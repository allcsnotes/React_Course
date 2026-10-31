import { useState } from 'react'
import type { ReactNode } from 'react'
import { useRenderCount } from './useRenderCount.ts'

type Props = { children: ReactNode }

export default function Layout({ children }: Props) {
  const n = useRenderCount()
  const [compact, setCompact] = useState(false)
  return (
    <div className={compact ? 'app compact' : 'app'}>
      <div className="header">
        <span className="logo">
          allcsvideos
          <span className="cnt">layout {n}</span>
        </span>
        <button
          className="ghost"
          onClick={() => setCompact(!compact)}
        >
          Compact view
        </button>
      </div>
      {children}
    </div>
  )
}
