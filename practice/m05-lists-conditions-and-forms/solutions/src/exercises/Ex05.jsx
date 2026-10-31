function PriceTag({ price }) {
  if (price === undefined) return <span>Price soon</span>
  if (price === 0) return <span className="free">Free</span>
  return <span>Rs {price}</span>
}

function CourseCard({ title, teacher = 'To be announced', price }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Teacher: {teacher}</p>
      <p>
        <PriceTag price={price} />
      </p>
    </div>
  )
}

export default function Ex05() {
  return (
    <div>
      <CourseCard title="React for Beginners" teacher="Meera" price={499} />
      <CourseCard title="Python from Zero" teacher="Meera" price={0} />
      <CourseCard title="Git Basics" />
    </div>
  )
}
