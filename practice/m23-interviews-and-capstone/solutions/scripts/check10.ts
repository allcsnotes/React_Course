// Run with: node scripts/check10.ts
import assert from 'node:assert/strict'
import { EMPTY, submit, validate } from '../src/lib/wizard.ts'

console.log('empty step 1:', validate(1, EMPTY))
assert.deepEqual(Object.keys(validate(1, EMPTY)), ['name', 'email'])
assert.deepEqual(validate(1, { ...EMPTY, name: ' Asha ', email: 'asha@example.com' }), {})
assert.deepEqual(Object.keys(validate(1, { ...EMPTY, name: 'A', email: 'nope' })), ['name', 'email'])
console.log('empty step 2:', validate(2, EMPTY))
assert.deepEqual(Object.keys(validate(2, EMPTY)), ['plan', 'terms'])
assert.deepEqual(validate(2, { ...EMPTY, plan: 'pro', terms: true }), {})
const ok = { name: 'Asha', email: 'asha@example.com', plan: 'pro' as const, terms: true }
console.log('submit ok:', await submit(ok, 10))
await assert.rejects(submit({ ...ok, email: 'x@fail.test' }, 10), /refused/)
console.log('wizard: all checks passed')
