import { useFetch } from './useFetch'
import type { Course } from './types'

export function DealBanner() {
  const { data } = useFetch<Course[]>('/api/courses')
  if (!data) return <p className="deal">Loading the deal...</p>
  const first = data[0]
  return (
    <p className="deal">
      Deal of the day: {first.title}, Rs {first.price}
    </p>
  )
}
