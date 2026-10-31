import { useState } from 'react'
import { uploadThumbnail } from './api.ts'

type Props = {
  value: string
  onChange: (url: string) => void
  error?: string
}

export default function Thumbnail({
  value,
  onChange,
  error,
}: Props) {
  const [pct, setPct] = useState<number | null>(null)
  const [problem, setProblem] = useState('')

  async function pick(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/'))
      return setProblem('Pick a picture file')
    if (file.size > 2 * 1024 * 1024)
      return setProblem('Pick a picture under 2 MB')
    setProblem('')
    setPct(0)
    try {
      onChange(await uploadThumbnail(file, setPct))
    } catch {
      setProblem('The upload failed. Please try again.')
    } finally {
      setPct(null)
    }
  }

  return (
    <div className="thumb">
      <div className="pic">
        {value ? (
          <img src={value} alt="Course thumbnail" />
        ) : (
          'No picture yet'
        )}
      </div>
      <div className="side">
        <b>Thumbnail</b>
        <label className="btn">
          Choose picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </label>
        {pct !== null && (
          <div className="prog">
            <div style={{ width: `${pct}%` }} />
            <span>{pct}%</span>
          </div>
        )}
        {(problem || error) && (
          <em className="err">{problem || error}</em>
        )}
      </div>
    </div>
  )
}
