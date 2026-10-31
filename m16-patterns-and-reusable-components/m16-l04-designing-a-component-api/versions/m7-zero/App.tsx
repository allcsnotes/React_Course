import { Quantity } from './Quantity.tsx'

export default function App() {
  return (
    <>
      <header><strong>allcsvideos · components</strong><span className="tag">demo</span></header>
      <main>
        <div className="panel">
          <h2>Seats in your cart</h2>
          <Quantity start={0} />
          <p className="small">Priya asked for start = 0</p>
        </div>
      </main>
    </>
  )
}
