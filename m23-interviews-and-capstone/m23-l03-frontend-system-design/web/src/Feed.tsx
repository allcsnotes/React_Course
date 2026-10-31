import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fetchFeed } from './api'
import PostCard from './PostCard'

const mode = new URLSearchParams(location.search).get('mode') ?? 'virtual'

export default function Feed() {
  const feed = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    initialPageParam: null as number | null,
    getNextPageParam: (last) => last.nextCursor,
  })
  const posts = feed.data?.pages.flatMap((p) => p.posts) ?? []
  const box = useRef<HTMLDivElement>(null)

  const v = useVirtualizer({
    count: posts.length,
    getScrollElement: () => box.current,
    estimateSize: () => 116,
    overscan: 3,
  })
  const items = v.getVirtualItems()
  const lastIndex = items.length ? items[items.length - 1].index : -1

  useEffect(() => {
    const nearEnd = mode === 'virtual' ? lastIndex >= posts.length - 3 : false
    if (nearEnd && feed.hasNextPage && !feed.isFetchingNextPage && !feed.isError) feed.fetchNextPage()
  }, [lastIndex, posts.length, feed])

  const sentinel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (mode !== 'plain' || !sentinel.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && feed.hasNextPage && !feed.isFetchingNextPage && !feed.isError) feed.fetchNextPage()
    }, { root: box.current })
    io.observe(sentinel.current)
    return () => io.disconnect()
  }, [feed])

  return (
    <main className="app">
      <h1>Community</h1>
      <div ref={box} className="scroll" role="feed" aria-busy={feed.isFetching} aria-label="Posts">
        {feed.isPending && <p className="note">Loading posts…</p>}
        {mode === 'virtual' ? (
          <div style={{ height: v.getTotalSize(), position: 'relative' }}>
            {items.map((it) => (
              <div key={posts[it.index].id} className="slot" style={{ transform: `translateY(${it.start}px)`, height: it.size }}>
                <PostCard post={posts[it.index]} index={it.index} />
              </div>
            ))}
          </div>
        ) : (
          posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)
        )}
        {mode === 'plain' && <div ref={sentinel} style={{ height: 1 }} />}
        {feed.isError && (
          <div className="retry" role="alert">
            <span>Could not load more posts.</span>
            <button onClick={() => feed.fetchNextPage()}>Try again</button>
          </div>
        )}
      </div>
    </main>
  )
}
