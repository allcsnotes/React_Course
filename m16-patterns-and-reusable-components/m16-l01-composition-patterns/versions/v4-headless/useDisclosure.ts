import { useState } from 'react'

export function useDisclosure(start = false) {
  const [open, setOpen] = useState(start)
  const toggle = () => setOpen((o) => !o)
  return {
    open,
    toggle,
    buttonProps: { onClick: toggle, 'aria-expanded': open },
  }
}
