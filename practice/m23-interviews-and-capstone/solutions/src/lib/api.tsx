import { useState } from 'react'

export const API = 'http://localhost:8239'
// ?fail=1 or ?slow=1 in the address bar switches the mode on from the start (the page reads it once).
const params = new URLSearchParams(window.location.search)
export const mode = { slow: params.has('slow'), fail: params.has('fail') }

// Added to every request: &delay=2500 makes the practice API slow, &fail=1 makes it answer 500.
export function modeQuery(): string {
  return (mode.slow ? '&delay=2500' : '') + (mode.fail ? '&fail=1' : '')
}

export function ApiMode() {
  const [slow, setSlow] = useState(mode.slow)
  const [fail, setFail] = useState(mode.fail)
  return (
    <div className="apimode">
      <label>
        <input type="checkbox" checked={slow} onChange={(e) => { mode.slow = e.target.checked; setSlow(e.target.checked) }} />
        Slow API (2.5 s)
      </label>
      <label>
        <input type="checkbox" checked={fail} onChange={(e) => { mode.fail = e.target.checked; setFail(e.target.checked) }} />
        Failing API (500)
      </label>
    </div>
  )
}
