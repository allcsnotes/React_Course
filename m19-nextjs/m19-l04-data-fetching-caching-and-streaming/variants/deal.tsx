import { cacheLife, cacheTag } from 'next/cache'

async function getOffer() {
  'use cache'
  cacheLife('hours')
  cacheTag('offer')
  const res = await fetch('http://localhost:8194/api/offer')
  return res.json()
}

export default async function Deal() {
  const offer = await getOffer()
  return <p>Offer number {offer.serial}: {offer.text}</p>
}
