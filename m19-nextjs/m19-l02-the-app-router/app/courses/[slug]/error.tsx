'use client'

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div className="oops">
      <h2>This course could not load</h2>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
