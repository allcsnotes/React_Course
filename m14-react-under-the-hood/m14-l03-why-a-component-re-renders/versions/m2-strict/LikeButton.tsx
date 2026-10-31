import { useState } from 'react'
import { useRenderCount } from './useRenderCount.ts'

export default function LikeButton() {
  const n = useRenderCount()
  const [liked, setLiked] = useState(false)
  return (
    <div className="lk">
      <button
        className="ghost"
        onClick={() => setLiked(!liked)}
      >
        {liked ? 'Liked' : 'Like'}
      </button>
      <span className="cnt">like {n}</span>
    </div>
  )
}
