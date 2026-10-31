export const revalidate = 5
export default async function T3() {
  const r = await fetch('http://localhost:8194/api/offer')
  const o = await r.json()
  return <p>offer {o.serial}</p>
}
