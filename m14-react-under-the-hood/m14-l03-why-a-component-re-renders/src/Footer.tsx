import { useRenderCount } from './useRenderCount.ts'

export default function Footer() {
  const n = useRenderCount()
  return (
    <div className="footer">
      allcsvideos
      <span className="cnt">footer {n}</span>
    </div>
  )
}
