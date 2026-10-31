import { Shell } from './Shell'
import { Tip } from './Tip'

export default function App() {
  return (
    <Shell>
      <div className="panel">
        <h2>React for Beginners</h2>
        <p>Teacher: Meera · lifetime access</p>
        <Tip text="Prices are in rupees. A course is yours for life, with every future update." />
      </div>
      <div className="panel">
        <h2>Python from Zero</h2>
        <p>Teacher: Meera · free</p>
      </div>
    </Shell>
  )
}
