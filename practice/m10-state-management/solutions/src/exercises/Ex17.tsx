import { useShallow } from 'zustand/react/shallow'
import { courses } from '../data.ts'
import { Renders } from '../Renders.tsx'
import { useStore17 } from '../lib/cartStore17.ts'

// Two fields in one selector: wrapped in useShallow, so a NEW object with the
// SAME fields inside does not count as a change.
function Summary() {
  const { count, coupon } = useStore17(
    useShallow((s) => ({ count: s.items.length, coupon: s.coupon })),
  )
  return (
    <div className="row">
      Summary: {count} courses · coupon {coupon ?? 'none'}
      <Renders />
    </div>
  )
}

function NoteBox() {
  const note = useStore17((s) => s.note)
  const setNote = useStore17((s) => s.setNote)
  return (
    <div className="row">
      <input type="text" value={note} placeholder="Note" onChange={(e) => setNote(e.target.value)} />
      <Renders />
    </div>
  )
}

function Buttons() {
  const add = useStore17((s) => s.add)
  const applyCoupon = useStore17((s) => s.applyCoupon)
  return (
    <div>
      <button onClick={() => add(courses[0])}>Add React for Beginners</button>
      <button onClick={() => add(courses[1])}>Add SQL in Two Weeks</button>
      <button onClick={() => applyCoupon('SAVE10')}>Apply SAVE10</button>
    </div>
  )
}

export default function Ex17() {
  return (
    <div className="card">
      <Summary />
      <Buttons />
      <NoteBox />
    </div>
  )
}
