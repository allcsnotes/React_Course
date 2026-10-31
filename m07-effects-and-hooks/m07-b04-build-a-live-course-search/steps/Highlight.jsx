export default function Highlight({ text, find }) {
  const lower = text.toLowerCase()
  const at = lower.indexOf(find.toLowerCase())
  if (find === '' || at === -1) return text

  const end = at + find.length
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, end)}</mark>
      {text.slice(end)}
    </>
  )
}
