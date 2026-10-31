import { buy } from './actions'

export default function Shop() {
  return (
    <div className="card">
      <h1>React for Beginners</h1>
      <div className="price">Rs 499</div>
      <form action={buy}><button>Buy this course</button></form>
    </div>
  )
}
