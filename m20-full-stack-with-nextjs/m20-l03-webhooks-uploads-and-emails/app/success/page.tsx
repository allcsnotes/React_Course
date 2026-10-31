import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { orders } from '@/lib/schema'

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams
  const [row] = await db.select().from(orders).where(eq(orders.id, Number(order)))
  return (
    <div className="card">
      <h1>Order {row?.id}</h1>
      <p>{row?.course}</p>
      <p>Status: <span className={`status ${row?.status}`}>{row?.status}</span></p>
      {row?.status === 'pending' && <p className="muted">Still pending? Refresh in a moment.</p>}
    </div>
  )
}
