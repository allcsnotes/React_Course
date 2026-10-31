import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orders, webhookEvents } from '@/lib/schema'
import { verify } from '@/lib/signature'
import { sendReceipt } from '@/lib/mail'

export async function POST(req: Request) {
  const raw = await req.text()
  const header = req.headers.get('pay-signature') ?? ''
  const check = verify(raw, header)
  if (check !== 'ok') {
    return Response.json({ error: check }, { status: 400 })
  }

  const event = JSON.parse(raw)
  const [seen] = await db
    .insert(webhookEvents)
    .values({ id: event.id, type: event.type })
    .onConflictDoNothing()
    .returning()
  if (!seen) return Response.json({ ok: true, duplicate: true })

  const [order] = await db.select().from(orders)
    .where(eq(orders.id, event.data.order_id))
  await sendReceipt('lukas@example.test', order)
  await db
    .update(orders)
    .set({ status: 'paid' })
    .where(eq(orders.id, order.id))
  return Response.json({ ok: true })
}
