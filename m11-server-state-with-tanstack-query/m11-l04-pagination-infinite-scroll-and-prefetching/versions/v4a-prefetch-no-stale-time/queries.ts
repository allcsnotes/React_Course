import { getCoursePage } from './api'

export const coursesQuery = (page: number) => ({
  queryKey: ['courses', page],
  queryFn: () => getCoursePage(page),
})
