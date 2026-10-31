import type { orders } from './schema'

type Order = typeof orders.$inferSelect

// the fake provider runs on port 8303 (a stand-in for test mode)
export async function createSession(order: Order) {
  const res = await fetch('http://localhost:8303/v1/sessions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.PAY_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      order_id: order.id,
      amount: order.amount,
      description: order.course,
      success_url: `http://localhost:5203/success?order=${order.id}`,
    }),
  })
  return res.json() as Promise<{ id: string; url: string }>
}
