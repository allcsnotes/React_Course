import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  switch (state.status) {
    case 'loading':
      return <p className="muted">Loading courses...</p>
    case 'error':
      return <p className="err">{state.message}</p>
    case 'success':
      return <List items={state.courses} renderItem={c => c.title} />
  }
}
