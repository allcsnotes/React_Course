import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export const List = <T>({
  items,
  renderItem,
}: ListProps<T>) => (
  <ul>
    {items.map((item, i) => (
      <li key={i}>{renderItem(item)}</li>
    ))}
  </ul>
)
