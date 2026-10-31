import { courses } from './data'
import type { State } from './states'

const weird: State = {
  status: 'loading',
  message: 'boom',
  courses,
}

export default function App() {
  return <main className="one">{weird.status}</main>
}
