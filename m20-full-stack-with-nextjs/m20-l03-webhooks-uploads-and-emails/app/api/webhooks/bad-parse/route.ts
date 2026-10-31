import { verify } from '@/lib/signature'

export async function POST(req: Request) {
  const event = await req.json()
  const header = req.headers.get('pay-signature') ?? ''
  const check = verify(JSON.stringify(event), header)
  if (check !== 'ok') {
    return Response.json({ error: check }, { status: 400 })
  }
  return Response.json({ ok: true })
}
