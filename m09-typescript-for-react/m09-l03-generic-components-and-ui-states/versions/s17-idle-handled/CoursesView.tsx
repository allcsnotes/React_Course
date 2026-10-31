import { assertNever } from './assertNever'
import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  switch (state.status) {
    case 'idle':
      return <p className="muted">Press a button to start.</p>
    case 'loading':
      return <p className="muted">Loading courses...</p>
    case 'error':
      return <p className="err">{state.message}</p>
    case 'success':
      return <List items={state.courses} renderItem={c => c.title} />
    default:
      return assertNever(state)
  }
}
