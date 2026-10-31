// Run with: node scripts/check04.ts   (no browser)
import assert from 'node:assert/strict'
import { addReply, COMMENTS, countReplies } from '../src/lib/comments.ts'

console.log('replies under Lukas:', countReplies(COMMENTS[0]))
assert.equal(countReplies(COMMENTS[0]), 3)
assert.equal(countReplies(COMMENTS[1]), 0)
const reply = { id: 'x', author: 'Asha', text: 'Hello', replies: [] }
const next = addReply(COMMENTS, 'c3', reply) // three levels deep
console.log('after adding a reply to c3:', countReplies(next[0]))
assert.equal(countReplies(next[0]), 4)
assert.equal(countReplies(COMMENTS[0]), 3) // the old tree is untouched
assert.equal(next[1], COMMENTS[1]) // the branch that did not change is the SAME object
console.log('comments: all checks passed')
