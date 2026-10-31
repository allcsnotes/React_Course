import { ImageResponse } from 'next/og'
import { findCourse } from '@/lib/courses'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = findCourse(slug)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80, background: '#0b1b33', color: 'white',
        }}
      >
        <div style={{ fontSize: 40, color: '#4c9dff' }}>allcsvideos</div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 20 }}>{course?.title}</div>
      </div>
    ),
    size,
  )
}
