import { slow } from '@/lib/api'

export const instant = false

export default async function Page() {
  const a = await slow('menu')
  const b = await slow('footer')
  return <p>{a.length + b.length} courses</p>
}
