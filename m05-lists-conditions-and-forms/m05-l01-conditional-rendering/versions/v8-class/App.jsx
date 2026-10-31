import { useState } from 'react'
import './App.css'

export default function App() {
  const [liked, setLiked] = useState(false)

  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera · 12 lessons</p>
      <button
        className={liked ? 'like on' : 'like'}
        onClick={() => setLiked(!liked)}
      >
        {liked ? 'Liked' : 'Like'}
      </button>
    </div>
  )
}
