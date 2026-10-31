function describe(id: number | string) {
  if (typeof id === 'number') {
    return id.toFixed(2)
  }
  return id.toUpperCase()
}

console.log(describe(7), describe('c-7'))
