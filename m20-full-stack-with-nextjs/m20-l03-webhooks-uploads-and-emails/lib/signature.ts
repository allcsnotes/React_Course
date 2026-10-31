import { createHmac, timingSafeEqual } from 'node:crypto'

const SECRET = process.env.PAY_WEBHOOK_SECRET!

type Result = 'ok' | 'bad signature' | 'too old'

// header looks like:  t=1793375783,v1=7281e2d3...
export function verify(raw: string, header: string): Result {
  const parts = Object.fromEntries(
    header.split(',').map(p => p.split('=')),
  )
  const t = Number(parts.t)
  const expected = createHmac('sha256', SECRET)
    .update(`${t}.${raw}`)
    .digest('hex')
  const got = Buffer.from(parts.v1 ?? '', 'hex')
  const want = Buffer.from(expected, 'hex')
  if (got.length !== want.length) return 'bad signature'
  if (!timingSafeEqual(got, want)) return 'bad signature'
  if (Math.abs(Date.now() / 1000 - t) > 300) return 'too old'
  return 'ok'
}
