import './App.css'

export default function App() {
  const count = 0
  return (
    <div className="demo">
      <p>bar: [{count && <b>3 new</b>}]</p>
      <p>fixed: [{count > 0 && <b>3 new</b>}]</p>
    </div>
  )
}
