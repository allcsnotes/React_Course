import './App.css'

export default function App() {
  const user = 'Lukas'

  return (
    <div className="card">
      {if (user) <h2>Hi, {user}</h2>}
    </div>
  )
}
