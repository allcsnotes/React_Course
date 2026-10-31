import { cacheLife } from 'next/cache'

async function getOffer() {
  'use cache'
  cacheLife({ revalidate: 5 })
  const res = await fetch('http://localhost:8194/api/offer')
  return res.json()
}

export default async function Offer() {
  const offer = await getOffer()
  return <p>Offer number {offer.serial}: {offer.text}</p>
}
