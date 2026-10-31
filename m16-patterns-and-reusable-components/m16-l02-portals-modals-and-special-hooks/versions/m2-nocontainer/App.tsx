import { CourseCard } from './CourseCard'
import { Shell } from './Shell'

export default function App() {
  return (
    <Shell>
      <div className="grid">
        <CourseCard title="Python from Zero" />
        <CourseCard title="React for Beginners" />
      </div>
      <div className="panel">
        <h2>Continue learning</h2>
        <p>Python from Zero · lesson 4 of 20</p>
        <div className="bar">
          <span style={{ width: '20%' }} />
        </div>
      </div>
    </Shell>
  )
}
