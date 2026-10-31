import { memo } from 'react'
import { useRenderCount } from './useRenderCount.ts'

function Footer() {
  const n = useRenderCount()
  return (
    <div className="footer">
      allcsvideos
      <span className="cnt">footer {n}</span>
    </div>
  )
}

export default memo(Footer)
