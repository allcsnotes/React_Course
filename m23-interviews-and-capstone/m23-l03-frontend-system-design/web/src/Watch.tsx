import { useEffect, useReducer, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Hls from 'hls.js'

type Video = { id: number; title: string; teacher: string; durationSeconds: number; manifest: string; captions: string }
type Status = 'loading' | 'playing' | 'paused' | 'buffering' | 'error'
type Action = 'ready' | 'play' | 'pause' | 'wait' | 'fail' | 'retry'

function reduce(_status: Status, action: Action): Status {
  switch (action) {
    case 'ready': return 'paused'
    case 'play': return 'playing'
    case 'pause': return 'paused'
    case 'wait': return 'buffering'
    case 'fail': return 'error'
    case 'retry': return 'loading'
  }
}

async function fetchVideo(): Promise<Video> {
  const res = await fetch('/api/video/1')
  if (!res.ok) throw new Error('video not found')
  return res.json()
}

export default function Watch() {
  const meta = useQuery({ queryKey: ['video', 1], queryFn: fetchVideo })
  const [status, dispatch] = useReducer(reduce, 'loading')
  const [attempt, again] = useReducer((n: number) => n + 1, 0)
  const ref = useRef<HTMLVideoElement>(null)
  const time = useRef<HTMLSpanElement>(null)
  const seek = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!meta.data || !el) return
    dispatch('retry')
    const hls = new Hls({ maxBufferLength: 20 })
    hls.loadSource(meta.data.manifest)
    hls.attachMedia(el)
    hls.on(Hls.Events.MANIFEST_PARSED, () => dispatch('ready'))
    hls.on(Hls.Events.ERROR, (_e, data) => { if (data.fatal) dispatch('fail') })
    ;(window as unknown as { hls: Hls }).hls = hls
    return () => hls.destroy()
  }, [meta.data, attempt])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) el.play(); else el.pause()
  }
  const seekBy = (s: number) => { if (ref.current) ref.current.currentTime += s }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return
    if (e.key === 'k' || e.key === ' ') { e.preventDefault(); toggle() }
    if (e.key === 'ArrowRight') seekBy(5)
    if (e.key === 'ArrowLeft') seekBy(-5)
  }

  if (meta.isError) return <main className="app"><div className="err" role="alert">Video not found.</div></main>
  return (
    <main className="app">
      <h1>{meta.data?.title ?? 'Loading…'}</h1>
      <div className="video-wrap" tabIndex={0} role="group" aria-label="Video player" onKeyDown={onKey}>
        <video
          ref={ref} muted playsInline
          onPlaying={() => dispatch('play')} onPause={() => dispatch('pause')} onWaiting={() => dispatch('wait')}
          onTimeUpdate={(e) => {
            if (time.current) time.current.textContent = e.currentTarget.currentTime.toFixed(0) + ' s'
            if (seek.current) seek.current.value = String(e.currentTarget.currentTime)
          }}
        >
          {meta.data && <track kind="captions" src={meta.data.captions} srcLang="en" label="English" default />}
        </video>
        <div className="controls">
          <button onClick={toggle} aria-label={status === 'playing' ? 'Pause' : 'Play'}>{status === 'playing' ? 'Pause' : 'Play'}</button>
          <span ref={time} aria-live="off">0 s</span>
          <input ref={seek} type="range" min={0} max={60} defaultValue={0} aria-label="Seek" onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value) }} />
        </div>
      </div>
      {status === 'error'
        ? <div className="err" role="alert">This video could not be played. <button className="btn" onClick={() => again()}>Try again</button></div>
        : <p className="status" role="status">{status}</p>}
    </main>
  )
}
