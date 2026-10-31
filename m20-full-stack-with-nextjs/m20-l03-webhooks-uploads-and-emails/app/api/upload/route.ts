import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'uploads')
const TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
}
const fail = (error: string, status: number) =>
  Response.json({ error }, { status })

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('thumbnail')
  if (!(file instanceof File)) return fail('no file', 400)
  const ext = TYPES[file.type]
  if (!ext) return fail('only PNG or JPEG', 415)
  if (file.size > 1_000_000) return fail('max 1 MB', 413)

  const name = `${randomUUID()}.${ext}`
  await mkdir(DIR, { recursive: true })
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(DIR, name), bytes)
  return Response.json({ url: `/files/${name}`, size: file.size })
}
