import { useRenderCount } from './useRenderCount.ts'

type Props = { cart: number; onAdd: () => void }

export default function Header({ cart, onAdd }: Props) {
  const n = useRenderCount()
  return (
    <div className="header">
      <span className="logo">
        allcsvideos
        <span className="cnt">header {n}</span>
      </span>
      <div className="bar">
        <span className="cart">Cart: {cart}</span>
        <button onClick={onAdd}>Add to cart</button>
      </div>
    </div>
  )
}
