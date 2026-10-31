import { Reviews } from './Reviews'
import { payHeaders } from './pay'

export default function App() {
  return (
    <main>
      <h1>React for Beginners</h1>
      <button onClick={() => fetch('/api/enroll', { method: 'POST', headers: payHeaders() })}>
        Enrol
      </button>
      <h2 className="sub">What students say</h2>
      <Reviews />
    </main>
  )
}
