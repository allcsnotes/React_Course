import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'uploads')

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('thumbnail') as File
  await mkdir(DIR, { recursive: true })
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(DIR, file.name), bytes)
  return Response.json({ saved: file.name })
}
