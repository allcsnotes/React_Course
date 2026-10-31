'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="oops">
      <h2>This course could not load</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
