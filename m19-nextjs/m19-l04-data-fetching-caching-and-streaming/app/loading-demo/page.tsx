import { getReviews } from '@/lib/api'

export default async function Page() {
  const reviews = await getReviews('react-for-beginners')
  return <p>{reviews.length} reviews</p>
}
