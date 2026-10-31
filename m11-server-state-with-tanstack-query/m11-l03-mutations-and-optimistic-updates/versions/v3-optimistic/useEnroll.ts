import { useMutation, useQueryClient } from '@tanstack/react-query'
import { enroll, type Course } from './api'

const key = ['courses']

function markEnrolled(list: Course[], slug: string) {
  return list.map((c) =>
    c.slug === slug ? { ...c, enrolled: true } : c,
  )
}

export function useEnroll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enroll,
    onMutate: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Course[]>(key)
      queryClient.setQueryData<Course[]>(key, (old = []) =>
        markEnrolled(old, slug),
      )
      return { previous }
    },
    onError: (_error, _slug, context) => {
      queryClient.setQueryData(key, context?.previous)
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
