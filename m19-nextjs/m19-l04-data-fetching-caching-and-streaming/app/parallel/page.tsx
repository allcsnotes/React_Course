import { slow } from '@/lib/api'

export const instant = false

export default async function Page() {
  const [a, b] = await Promise.all([slow('menu'), slow('footer')])
  return <p>{a.length + b.length} courses</p>
}
