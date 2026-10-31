import { useState } from 'react'

export default function D1b() {
  const [plain, setPlain] = useState(0)
  const [fn, setFn] = useState(0)
  return (
    <main>
      <h1>plain {plain} · updater {fn}</h1>
      <button id="plain" onClick={() => {
        setPlain(plain + 1)
        setPlain(plain + 1)
        setPlain(plain + 1)
      }}>add three (plain)</button>
      <button id="fn" onClick={() => {
        setFn(c => c + 1)
        setFn(c => c + 1)
        setFn(c => c + 1)
      }}>add three (updater)</button>
    </main>
  )
}
