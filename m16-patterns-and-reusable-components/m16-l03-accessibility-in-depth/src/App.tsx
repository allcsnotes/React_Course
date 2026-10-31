import BadPage from './bad/CoursePage'
import GoodPage from './good/CoursePage'
import LatePage from './late/CoursePage'
import { M1, M2, M3 } from './mistakes/Mistakes'

export default function App() {
  const q = new URLSearchParams(location.search)
  const d = q.get('d')
  if (d === 'm1') return <M1 />
  if (d === 'm2') return <M2 />
  if (d === 'm3') return <M3 />
  if (q.get('v') === 'late') return <LatePage />
  return q.get('v') === 'bad' ? <BadPage /> : <GoodPage />
}
