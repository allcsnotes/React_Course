// Run with: node scripts/ex18.ts
import assert from 'node:assert/strict'
import { whereLives, sharedTool } from '../src/lib/whereLives.ts'

assert.equal(whereLives({ inAddress: false, fromServer: false, sharedFar: false }), 'local')
assert.equal(whereLives({ inAddress: false, fromServer: true, sharedFar: true }), 'server')
assert.equal(whereLives({ inAddress: false, fromServer: false, sharedFar: true }), 'shared')
assert.equal(whereLives({ inAddress: true, fromServer: false, sharedFar: true }), 'address')
// order matters: the address question comes first
assert.equal(whereLives({ inAddress: true, fromServer: true, sharedFar: true }), 'address')
assert.equal(sharedTool(true), 'zustand')
assert.equal(sharedTool(false), 'context')
console.log('whereLives: all checks passed')
