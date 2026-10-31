import { auth } from '@/auth'
import { enroll } from './actions'

export default async function Home() {
  const session = await auth()
  return (
    <div className="card">
      <h1>React for Beginners</h1>
      <p className="hint">Meera · 12 lessons · hooks, state and Next.js</p>
      <form action={enroll}>
        <input type="hidden" name="course" value="React for Beginners" />
        <button disabled={!session}>Enroll</button>
      </form>
      {!session && <p className="hint">Sign in to enroll.</p>}
    </div>
  )
}
