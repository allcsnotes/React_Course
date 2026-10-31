import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  if (state.status === 'loading') {
    return <p className="muted">{state.message}</p>
  }
  if (state.status === 'error') {
    return <p className="err">{state.message}</p>
  }
  return <List items={state.courses} renderItem={c => c.title} />
}
