import { useState } from 'react'

function LikeButton({ course }) {
  const [likes, setLikes] = useState(0)

  return (
    <button onClick={() => setLikes(likes + 1)}>
      {course}: {likes} likes
    </button>
  )
}

export default function App() {
  return (
    <div className="counter">
      <LikeButton course="React" />
      <LikeButton course="Python" />
    </div>
  )
}
