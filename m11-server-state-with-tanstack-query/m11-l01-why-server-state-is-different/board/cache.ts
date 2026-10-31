export const API = 'http://localhost:8111'
const board = new Map()
const asking = new Map()
const FRESH_MS = 2000

async function load(key: string) {
  console.log('  trip to the server:', key)
  const res = await fetch(API + key)
  const data = await res.json()
  board.set(key, { data, at: Date.now() })
  asking.delete(key)
  return data
}

function fromServer(key: string) {
  if (!asking.has(key)) asking.set(key, load(key))
  return asking.get(key)
}

export async function getCached(key: string) {
  const copy = board.get(key)
  if (!copy) return fromServer(key)
  if (Date.now() - copy.at < FRESH_MS) return copy.data
  fromServer(key)
  return copy.data
}
