function Card(props) {
  console.log(props)
  return (
    <div className="card">
      <h2>{props.title}</h2>
      <div className="body">
        {props.children}
      </div>
    </div>
  )
}

export default Card
