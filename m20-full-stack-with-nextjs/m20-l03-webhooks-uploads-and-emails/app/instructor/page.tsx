import { readdir } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

export default async function Instructor() {
  const dir = path.join(process.cwd(), 'uploads')
  const files = await readdir(dir).catch(() => [])
  const latest = files.at(-1)
  return (
    <div className="card">
      <h1>Course thumbnail</h1>
      {latest && (
        <img className="thumb" src={`/files/${latest}`} alt="" />
      )}
      <form
        action="/api/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="thumbnail" />
        <button>Upload</button>
      </form>
    </div>
  )
}
