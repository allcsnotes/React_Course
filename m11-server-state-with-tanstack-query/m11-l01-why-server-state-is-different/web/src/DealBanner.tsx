import { useCourses } from './useCourses'

export function DealBanner() {
  const { data } = useCourses()
  if (!data) return <p className="deal">Loading the deal...</p>
  const first = data[0]
  return <p className="deal">Deal of the day: {first.title}, Rs {first.price}</p>
}
