import { useReducer } from 'react'

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'add'; amount: number }
  | { type: 'reset' }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

// The rule book: current seats + one slip in, next seats out.
function seatsReducer(seats: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return seats + 1
    case 'decrement':
      return Math.max(0, seats - 1)
    case 'add':
      return seats + action.amount
    case 'reset':
      return 0
    default:
      return assertNever(action)
  }
}

export default function Ex10() {
  const [seats, dispatch] = useReducer(seatsReducer, 0)

  return (
    <div className="card">
      <h3>Seats booked: {seats}</h3>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'add', amount: 5 })}>+5</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  )
}
