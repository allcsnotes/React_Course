import { useState } from 'react'
import { CoursesView } from './CoursesView'
import { courses } from './data'
import type { State } from './states'

export default function App() {
  const [state, setState] = useState<State>({
    status: 'loading',
  })
  const idle = () => setState({ status: 'idle' })
  const loading = () => setState({ status: 'loading' })
  const loaded = () => setState({ status: 'success', courses })
  return (
    <main className="one">
      <div className="row">
        <button onClick={idle}>idle</button>
        <button onClick={loading}>loading</button>
        <button onClick={loaded}>success</button>
      </div>
      <section>
        <CoursesView state={state} />
      </section>
    </main>
  )
}
