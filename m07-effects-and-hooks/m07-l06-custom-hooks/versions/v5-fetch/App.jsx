import { useFetch } from './useFetch.js'
import './App.css'

export default function App() {
  const { data, status, error } = useFetch(
    'http://localhost:8176/api/courses?delay=700'
  )

  return (
    <div className="card">
      <h2>Courses</h2>
      {status === 'loading' && <p className="note">Loading...</p>}
      {status === 'error' && <p className="err">{error}</p>}
      {status === 'success' && (
        <ul>
          {data.map(c => <li key={c.id}>{c.title}</li>)}
        </ul>
      )}
    </div>
  )
}
