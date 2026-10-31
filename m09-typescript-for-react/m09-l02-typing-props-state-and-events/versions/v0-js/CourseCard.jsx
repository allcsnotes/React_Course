export default function CourseCard({
  title,
  price,
}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Price with fee: Rs {price + 50}</p>
    </div>
  )
}
