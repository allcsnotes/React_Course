import { useState } from 'react'

export default function Ex07() {
  const [likes, setLikes] = useState(0)

  return (
    <div className="card">
      <h3>React for Beginners</h3>
      <p>Likes: {likes}</p>
      <button onClick={() => setLikes(likes + 1)}>Like</button>
      <button onClick={() => setLikes(0)}>Reset</button>
    </div>
  )
}
