export function Field({
  label,
  ref,
}: {
  label: string
  ref?: React.Ref<HTMLInputElement>
}) {
  return (
    <label>
      {label}
      <input ref={ref} name="email" />
    </label>
  )
}
