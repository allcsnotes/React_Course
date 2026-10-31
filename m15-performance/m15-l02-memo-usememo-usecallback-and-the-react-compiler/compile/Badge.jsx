export default function Badge({ count }) {
  const text = count + ' in cart'
  return <b className="badge">{text}</b>
}
