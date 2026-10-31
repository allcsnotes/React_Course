export type Course = { slug: string; title: string; teacher: string; price: number }
export type Order = { id: string; courses: number; total: number }

export const fmt = (n: number) => (n === 0 ? 'Free' : `Rs ${n}`)

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  return res.json()
}

export async function placeOrder(slugs: string[], coupon: string): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ slugs, coupon }),
  })
  return res.json()
}
