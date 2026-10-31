import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { toggleLike, type FeedPage } from './api'

const key = ['feed']
type Feed = InfiniteData<FeedPage, number | null>

function flip(data: Feed, id: number): Feed {
  return {
    ...data,
    pages: data.pages.map((pg) => ({
      ...pg,
      posts: pg.posts.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    })),
  }
}

export function useLike() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleLike,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Feed>(key)
      if (previous) queryClient.setQueryData<Feed>(key, flip(previous, id))
      return { previous }
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(key, context?.previous)
    },
  })
}
