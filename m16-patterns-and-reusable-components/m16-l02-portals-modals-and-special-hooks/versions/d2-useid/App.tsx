import { EmailField } from './EmailField'
import { Shell } from './Shell'

export default function App() {
  return (
    <Shell>
      <div className="panel">
        <h2>Join the waitlist</h2>
        <EmailField label="Your email" />
      </div>
      <div className="panel">
        <h2>Gift a course</h2>
        <EmailField label="Friend's email" />
      </div>
      <div className="panel">
        <h2>Your courses</h2>
        <p>Python from Zero · React for Beginners</p>
      </div>
    </Shell>
  )
}
