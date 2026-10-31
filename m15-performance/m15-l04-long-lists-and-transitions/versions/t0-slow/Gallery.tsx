import GalleryCard from './GalleryCard'
import { COURSES } from './data'

export default function Gallery({ query }: { query: string }) {
  const shown = COURSES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 1500)

  return (
    <>
      <div className="found">{shown.length} courses match</div>
      <div className="gallery">
        {shown.map((c) => (
          <GalleryCard key={c.id} course={c} />
        ))}
      </div>
    </>
  )
}
