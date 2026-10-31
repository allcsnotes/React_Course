import type { ReactNode } from 'react'

interface ListProps {
  items: any[]
  renderItem: (item: any) => ReactNode
}

export function List({ items, renderItem }: ListProps) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
