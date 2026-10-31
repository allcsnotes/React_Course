export type Post = { id: number; author: string; text: string; likes: number; liked: boolean }
export type FeedPage = { posts: Post[]; nextCursor: number | null }

export async function fetchFeed(cursor: number | null): Promise<FeedPage> {
  const q = cursor ? `&cursor=${cursor}` : ''
  const res = await fetch(`/api/feed?limit=20${q}`)
  if (!res.ok) throw new Error('Could not load posts')
  return res.json()
}

export async function toggleLike(id: number): Promise<Post> {
  const res = await fetch(`/api/posts/${id}/like`, { method: 'POST' })
  if (!res.ok) throw new Error('Could not like the post')
  return res.json()
}
