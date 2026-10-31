import { useParams } from 'react-router'
import { useCourse } from './queries.ts'

export function usePage() {
  const { slug } = useParams()
  return useCourse(slug)
}
