export function Receipt({ items }: { items: any[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.slug}>{item}</li>
      ))}
    </ul>
  )
}
