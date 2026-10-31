export function Receipt({ items }: { items: any[] }) {
  return (
    <ul className="receipt">
      {items.map((item) => (
        <li key={item.slug}>{item}</li>
      ))}
    </ul>
  )
}
