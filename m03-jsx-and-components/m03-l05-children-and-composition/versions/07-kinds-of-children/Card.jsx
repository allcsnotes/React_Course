function Card({ title, children }) {
  console.log(children)
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="body">{children}</div>
    </div>
  )
}

export default Card
