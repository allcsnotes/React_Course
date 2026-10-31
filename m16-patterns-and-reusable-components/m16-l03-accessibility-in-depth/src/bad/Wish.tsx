import { useState } from 'react'

export function Wish({ say }: { say: (m: string) => void }) {
  const [on, setOn] = useState(false)
  function toggle() {
    setOn(!on)
    say(on ? 'Removed from wishlist' : 'Saved to wishlist')
  }
  return (
    <button className={on ? 'heart on' : 'heart'} onClick={toggle}>
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="currentColor"
      >
        <path d="M12 21l-8-8a5 5 0 0 1 8-7 5 5 0 0 1 8 7z" />
      </svg>
    </button>
  )
}
