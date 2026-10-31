import { useReducer, useState } from 'react'

type Lesson = { id: number; title: string; done: boolean }
type State = { lessons: Lesson[] }

type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clearDone' }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const id = state.lessons.reduce((max, l) => Math.max(max, l.id), 0) + 1
      return { lessons: [...state.lessons, { id, title: action.title, done: false }] }
    }
    case 'toggle':
      return { lessons: state.lessons.map((l) => (l.id === action.id ? { ...l, done: !l.done } : l)) }
    case 'remove':
      return { lessons: state.lessons.filter((l) => l.id !== action.id) }
    default:
      return assertNever(action)
  }
}

export default function Ex14Broken() {
  const [state, dispatch] = useReducer(reducer, {
    lessons: [
      { id: 1, title: 'Prop drilling', done: true },
      { id: 2, title: 'Context', done: true },
      { id: 3, title: 'useReducer', done: false },
    ],
  })
  const [title, setTitle] = useState('')

  return (
    <div className="card">
      <h3>Study checklist ({state.lessons.filter((l) => l.done).length} of {state.lessons.length} done)</h3>
      {state.lessons.map((l) => (
        <div key={l.id}>
          <label>
            <input type="checkbox" checked={l.done} onChange={() => dispatch({ type: 'toggle', id: l.id })} />{' '}
            {l.title}
          </label>{' '}
          <button onClick={() => dispatch({ type: 'remove', id: l.id })}>Remove</button>
        </div>
      ))}
      <input type="text" value={title} placeholder="New lesson" onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={() => {
          if (title.trim() === '') return
          dispatch({ type: 'add', title: title.trim() })
          setTitle('')
        }}
      >
        Add
      </button>
      <button onClick={() => dispatch({ type: 'clearDone' })}>Clear finished</button>
    </div>
  )
}
