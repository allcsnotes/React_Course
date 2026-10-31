import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!/^[0-9a-f-]{36}\.(png|jpg)$/.test(name)) return new Response('not found', { status: 404 })
  const bytes = await readFile(path.join(process.cwd(), 'uploads', name)).catch(() => null)
  if (!bytes) return new Response('not found', { status: 404 })
  return new Response(bytes, { headers: { 'content-type': name.endsWith('png') ? 'image/png' : 'image/jpeg' } })
}
