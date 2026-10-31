const rows = Array.from(
  { length: 10000 },
  (_, i) => `Course number ${i + 1}`,
)

export default function BigList() {
  return (
    <ul>
      {rows.map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  )
}
