import { useState } from 'react'
import { Switch } from './Switch.tsx'

export default function App() {
  const [dark, setDark] = useState(false)
  return (
    <>
      <header><strong>allcsvideos · components</strong><span className="tag">demo</span></header>
      <main>
        <div className="panel">
          <div className="row" style={{ flexDirection: 'column', gap: 4 }}>
            <Switch label="Email me about new courses" defaultChecked />
            <Switch label="Dark mode" checked={dark} onChange={setDark} />
            <Switch label="Locked by the page" checked={false} onChange={() => {}} />
          </div>
          <p className="small">The page's dark mode state: {dark ? 'on' : 'off'}</p>
          <button className="btn md secondary" onClick={() => setDark(true)}>Turn dark mode on</button>
        </div>
      </main>
    </>
  )
}
