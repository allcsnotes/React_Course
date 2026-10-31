export default function Badge({ count }) {
  'use no memo'
  const text = count + ' in cart'
  return <b className="badge">{text}</b>
}
