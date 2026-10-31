import { memo } from 'react'
import type { Post } from './api'
import { useLike } from './useLike'

function PostCard({ post, index }: { post: Post; index: number }) {
  const like = useLike()
  return (
    <article className="post" aria-posinset={index + 1} aria-setsize={-1} aria-labelledby={`a${post.id}`}>
      <header>
        <span className="avatar" aria-hidden="true">{post.author[0]}</span>
        <strong id={`a${post.id}`}>{post.author}</strong>
        <span className="muted">post {post.id}</span>
      </header>
      <p>{post.text}</p>
      <button
        className={post.liked ? 'like on' : 'like'}
        aria-pressed={post.liked}
        aria-label="Like"
        onClick={() => like.mutate(post.id)}
      >
        <span aria-hidden="true">♥</span> <span className="count">{post.likes}</span>
      </button>
    </article>
  )
}

export default memo(PostCard)
