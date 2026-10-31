import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function List<T>({
  items,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
