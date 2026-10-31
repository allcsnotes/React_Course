import { useRef } from 'react'

export default function Renders({ name }: { name: string }) {
  const count = useRef(0)
  count.current += 1
  return <i className="rc" data-name={name}>×{count.current}</i>
}
