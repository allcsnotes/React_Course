import { Shell } from './Shell'
import { useOnlineStatus } from './useOnlineStatus'

export default function App() {
  const online = useOnlineStatus()
  return (
    <>
      <div className={online ? 'banner on' : 'banner off'}>
        {online ? 'You are online' : 'You are offline: check your connection'}
      </div>
      <Shell>
        <div className="panel">
          <h2>Python from Zero</h2>
          <p>Lesson 4 of 20</p>
        </div>
        <div className="panel">
          <h2>Up next</h2>
          <p>Lesson 5 · Lists and loops</p>
        </div>
      </Shell>
    </>
  )
}
