import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('offer', 'max')
  return Response.json({ revalidated: true })
}
