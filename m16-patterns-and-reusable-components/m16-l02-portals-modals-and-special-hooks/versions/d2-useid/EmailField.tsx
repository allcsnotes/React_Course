import { useId } from 'react'

type Props = { label: string }

export function EmailField({ label }: Props) {
  const id = useId()
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" />
    </>
  )
}
