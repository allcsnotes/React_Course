import { useEffect, useRef, useState } from 'react'
import { move } from '../lib/reorder.ts'

const START = ['What React Is', 'Props', 'useState', 'useEffect', 'Context']

export default function T09() {
  const [list, setList] = useState(START)
  const [said, setSaid] = useState('')
  const focusWant = useRef<{ name: string; dir: 'up' | 'down' } | null>(null)
  const box = useRef<HTMLOListElement>(null)

  function go(name: string, dir: 'up' | 'down') {
    const from = list.indexOf(name)
    const to = dir === 'up' ? from - 1 : from + 1
    const next = move(list, from, to)
    if (next === list) return
    setList(next)
    setSaid(`Moved ${name} to position ${to + 1} of ${list.length}`)
    // At the edge the pressed button becomes disabled, so focus goes to the other one.
    const atEdge = dir === 'up' ? to === 0 : to === list.length - 1
    focusWant.current = { name, dir: atEdge ? (dir === 'up' ? 'down' : 'up') : dir }
  }

  useEffect(() => {
    const w = focusWant.current
    if (!w) return
    focusWant.current = null
    box.current?.querySelector<HTMLElement>(`[data-name="${w.name}"][data-dir="${w.dir}"]`)?.focus()
  })

  return (
    <div>
      <ol className="order" ref={box}>
        {list.map((name, i) => (
          <li key={name}>
            <span>{i + 1}. {name}</span>
            <button data-name={name} data-dir="up" aria-label={`Move ${name} up`} disabled={i === 0} onClick={() => go(name, 'up')}>Up</button>
            <button data-name={name} data-dir="down" aria-label={`Move ${name} down`} disabled={i === list.length - 1} onClick={() => go(name, 'down')}>Down</button>
          </li>
        ))}
      </ol>
      <button onClick={() => { setList(START); setSaid('Order reset') }}>Reset order</button>
      <p role="status" data-testid="said">{said}</p>
      <p data-testid="order">Order: {list.join(', ')}</p>
    </div>
  )
}
