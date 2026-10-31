import { Waitlist } from './Waitlist'

export default function App() {
  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">Coming soon</span>
      </header>
      <main>
        <div className="panel">
          <h2>Join the waitlist</h2>
          <Waitlist initial={['meera@example.com', 'priya@example.com']} />
        </div>
      </main>
    </>
  )
}
