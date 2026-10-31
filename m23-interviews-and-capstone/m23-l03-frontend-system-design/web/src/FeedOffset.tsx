import { useInfiniteQuery } from '@tanstack/react-query'
import type { Post } from './api'

type OffsetPage = { posts: Post[]; nextOffset: number | null }

async function fetchPage(offset: number): Promise<OffsetPage> {
  const res = await fetch(`/api/feed-offset?limit=5&offset=${offset}`)
  return res.json()
}

export default function FeedOffset() {
  const feed = useInfiniteQuery({
    queryKey: ['feed-offset'],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset,
  })
  const posts = feed.data?.pages.flatMap((p) => p.posts) ?? []
  return (
    <main className="app">
      <h1>Community (page numbers)</h1>
      <div className="scroll">
        {posts.map((p) => (
          <article key={p.id} className="post">
            <header><strong>{p.author}</strong><span className="muted">post {p.id}</span></header>
            <p>{p.text}</p>
          </article>
        ))}
        <div className="retry" style={{ background: '#e8f0ff', borderColor: '#1a7cff' }}>
          <button onClick={() => feed.fetchNextPage()}>Load more</button>
        </div>
      </div>
    </main>
  )
}
