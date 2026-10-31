import { LoadedSchema } from './schema.ts'

export async function getCourse() {
  const res = await fetch('/api/instructor/course')
  if (!res.ok)
    throw new Error(`Server answered ${res.status}`)
  return LoadedSchema.parse(await res.json())
}

export function uploadThumbnail(
  file: File,
  onProgress: (pct: number) => void,
) {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/instructor/thumbnail')
    xhr.upload.onprogress = (e) =>
      onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () =>
      xhr.status === 200
        ? resolve(JSON.parse(xhr.responseText).url)
        : reject(new Error(`Server answered ${xhr.status}`))
    xhr.onerror = () => reject(new Error('Network error'))
    const form = new FormData()
    form.append('thumbnail', file)
    xhr.send(form)
  })
}
