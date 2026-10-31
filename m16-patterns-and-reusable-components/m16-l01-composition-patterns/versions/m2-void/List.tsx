import type { ReactNode } from 'react'

type Props<T> = {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function List<T>({ items, renderItem }: Props<T>) {
  return <ul className="items">{items.map(renderItem)}</ul>
}
