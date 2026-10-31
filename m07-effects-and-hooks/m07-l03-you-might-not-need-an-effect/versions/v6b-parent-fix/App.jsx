import { useState } from 'react'
import './App.css'

let renders = 0

function LikeButton({ onLike }) {
  const [liked, setLiked] = useState(false)

  function handleClick() {
    const next = !liked
    setLiked(next)
    onLike(next)
  }

  return (
    <button onClick={handleClick}>
      {liked ? 'Liked' : 'Like'}
    </button>
  )
}

export default function App() {
  const [total, setTotal] = useState(0)

  function handleLike(liked) {
    setTotal(t => (liked ? t + 1 : t - 1))
  }

  console.log('render', ++renders, 'total', total)

  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <LikeButton onLike={handleLike} />
      <p className="total">Likes: {total}</p>
    </div>
  )
}
