import { useLayoutEffect, useRef, useState } from 'react'

function slowDown(ms: number) {
  const end = performance.now() + ms
  while (performance.now() < end) {
    // pretend this component is heavy to draw
  }
}

export function Tip({ text }: { text: string }) {
  const [shown, setShown] = useState(false)
  const [top, setTop] = useState(0)
  const tipRef = useRef<HTMLDivElement>(null)
  const timer = useRef(0)

  function show() {
    timer.current = window.setTimeout(() => setShown(true), 150)
  }
  function hide() {
    clearTimeout(timer.current)
    setShown(false)
  }

  useLayoutEffect(() => {
    if (shown && tipRef.current) {
      setTop(-tipRef.current.offsetHeight - 8)
    }
  }, [shown])

  slowDown(30)
  return (
    <span className="tipwrap" onMouseEnter={show} onMouseLeave={hide}>
      <button>Why this price?</button>
      {shown && (
        <div className="tip" ref={tipRef} style={{ top }}>
          {text}
        </div>
      )}
    </span>
  )
}
