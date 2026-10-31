import { getReviews } from '@/lib/api'

export default async function Reviews({ slug }: { slug: string }) {
  const reviews = await getReviews(slug)
  return (
    <div className="reviews">
      {reviews.map((r) => (
        <blockquote key={r.name} className="review">
          <p>“{r.text}”</p>
          <footer>
            {r.name} · {'★'.repeat(r.stars)}
          </footer>
        </blockquote>
      ))}
    </div>
  )
}
