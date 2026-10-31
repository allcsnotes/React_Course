import { useEffect, useRef } from 'react'

export function useSentinel(
  onVisible: () => void,
  enabled: boolean,
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onVisible()
    })
    observer.observe(el)
  }, [enabled, onVisible])

  return ref
}
