import { useState } from 'react'

function Notifications({ count }) {
  if (count === 0) return null
  return <p>You have {count} new notifications</p>
}

export default function Ex16() {
  const [signedIn, setSignedIn] = useState(false)
  const [notices, setNotices] = useState(3)

  if (!signedIn) {
    return (
      <div className="card">
        <p>Please sign in</p>
        <button onClick={() => setSignedIn(true)}>Sign in as Lukas</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>Welcome back, Lukas</h3>
      <Notifications count={notices} />
      <button onClick={() => setNotices(0)}>Clear notifications</button>
      <button onClick={() => setSignedIn(false)}>Sign out</button>
      <p>{notices === 0 ? 'All caught up' : 'Check your inbox'}</p>
    </div>
  )
}
