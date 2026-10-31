// Pure: returns a NEW array with the item at `from` moved to `to`. Out-of-range moves return the list unchanged.
export function move<T>(list: T[], from: number, to: number): T[] {
  if (from < 0 || from >= list.length || to < 0 || to >= list.length || from === to) return list
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}
