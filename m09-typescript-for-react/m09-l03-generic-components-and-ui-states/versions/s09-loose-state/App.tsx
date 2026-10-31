import { useState } from 'react'
import { CoursesView } from './CoursesView'
import { courses } from './data'
import type { State } from './states'

const weird: State = {
  status: 'loading',
  message: 'boom',
  courses,
}

export default function App() {
  const [state, setState] = useState<State>({
    status: 'loading',
  })
  const loading = () => setState({ status: 'loading' })
  const failed = () =>
    setState({ status: 'error', message: 'Server is down' })
  const loaded = () => setState({ status: 'success', courses })
  console.log(weird.status)
  return (
    <main className="one">
      <div className="row">
        <button onClick={loading}>loading</button>
        <button onClick={failed}>error</button>
        <button onClick={loaded}>success</button>
      </div>
      <section>
        <CoursesView state={state} />
      </section>
    </main>
  )
}
