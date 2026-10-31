type Props = { label: string }

export function EmailField({ label }: Props) {
  return (
    <>
      <label htmlFor="email">{label}</label>
      <input id="email" type="email" />
    </>
  )
}
