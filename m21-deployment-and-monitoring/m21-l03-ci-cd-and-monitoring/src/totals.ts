export type Item = { slug: string; title: string; price: number }

export function total(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}
