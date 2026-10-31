import type { Theme } from './types.ts'

export default function Logo({ theme }: { theme: Theme }) {
  const color = theme === 'dark' ? '#8ab4ff' : '#1a56db'
  return (
    <span className="logo">
      <svg width="26" height="26" viewBox="0 0 26 26">
        <rect width="26" height="26" rx="7" fill={color} />
      </svg>
      allcsvideos
    </span>
  )
}
