import { promises as fs } from 'node:fs'
import path from 'node:path'

const FILE = path.join(process.cwd(), 'data', 'reviews.json')

export type Review = { id: string; name: string; text: string }

export async function readReviews(): Promise<Review[]> {
  return JSON.parse(await fs.readFile(FILE, 'utf8'))
}

export async function addReview(name: string, text: string) {
  const all = await readReviews()
  all.unshift({ id: 'r' + Date.now(), name, text })
  await fs.writeFile(FILE, JSON.stringify(all, null, 2))
}

export async function removeReview(id: string) {
  const all = await readReviews()
  await fs.writeFile(FILE, JSON.stringify(all.filter(r => r.id !== id), null, 2))
}
