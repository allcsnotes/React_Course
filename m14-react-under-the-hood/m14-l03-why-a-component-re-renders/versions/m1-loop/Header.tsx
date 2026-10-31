import CartButton from './CartButton.tsx'
import { useRenderCount } from './useRenderCount.ts'

export default function Header() {
  const n = useRenderCount()
  return (
    <div className="header">
      <span className="logo">
        allcsvideos
        <span className="cnt">header {n}</span>
      </span>
      <CartButton />
    </div>
  )
}
