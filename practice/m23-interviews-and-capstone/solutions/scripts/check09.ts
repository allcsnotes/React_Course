// Run with: node scripts/check09.ts
import assert from 'node:assert/strict'
import { move } from '../src/lib/reorder.ts'

const a = ['A', 'B', 'C', 'D']
console.log('move C up:', move(a, 2, 1))
assert.deepEqual(move(a, 2, 1), ['A', 'C', 'B', 'D'])
assert.deepEqual(move(a, 0, 3), ['B', 'C', 'D', 'A'])
assert.equal(move(a, 0, -1), a) // first item cannot go up: same array back
assert.equal(move(a, 3, 4), a) // last item cannot go down
assert.deepEqual(a, ['A', 'B', 'C', 'D']) // the input never changes
console.log('reorder: all checks passed')
