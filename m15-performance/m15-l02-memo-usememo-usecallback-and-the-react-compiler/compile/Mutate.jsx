export default function Cheapest({ courses }) {
  courses.sort((a, b) => a.price - b.price)
  return <p>{courses[0].title}</p>
}
