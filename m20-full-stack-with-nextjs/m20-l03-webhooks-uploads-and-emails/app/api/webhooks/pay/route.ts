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
  const order = await db.transaction(async tx => {
    const [seen] = await tx
      .insert(webhookEvents)
      .values({ id: event.id, type: event.type })
      .onConflictDoNothing()
      .returning()
    if (!seen) return null
    const [row] = await tx
      .update(orders)
      .set({ status: 'paid' })
      .where(eq(orders.id, event.data.order_id))
      .returning()
    return row
  })
  if (!order) return Response.json({ ok: true, duplicate: true })

  try {
    await sendReceipt('lukas@example.test', order)
  } catch (e) {
    console.error('receipt email failed', e)
  }
  return Response.json({ ok: true })
}
