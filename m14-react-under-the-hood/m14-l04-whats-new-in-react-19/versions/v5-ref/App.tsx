import { useRef } from 'react'
import { Field } from './Field'

export default function App() {
  const emailRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">Coming soon</span>
      </header>
      <main>
        <div className="panel">
          <h2>Join the waitlist</h2>
          <form>
            <Field label="Email" ref={emailRef} />
            <button type="button" onClick={() => emailRef.current?.focus()}>
              Focus the box
            </button>
          </form>
          <ul className="list">
            <li>meera@example.com</li>
            <li>priya@example.com</li>
          </ul>
        </div>
      </main>
    </>
  )
}
