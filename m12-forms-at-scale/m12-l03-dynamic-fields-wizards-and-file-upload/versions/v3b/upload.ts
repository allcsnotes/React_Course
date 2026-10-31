type Sent = { filename: string; bytes: number }
type Progress = (percent: number) => void

export function upload(file: File, onProgress: Progress) {
  return new Promise<Sent>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload')
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText)
      if (xhr.status === 200) resolve(data)
      else reject(new Error(data.error))
    }
    xhr.onerror = () => reject(new Error('The network failed'))
    const body = new FormData()
    body.append('thumbnail', file)
    xhr.send(body)
  })
}
