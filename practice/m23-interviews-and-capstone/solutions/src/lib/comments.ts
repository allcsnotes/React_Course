export type Comment = { id: string; author: string; text: string; replies: Comment[] }

export const COMMENTS: Comment[] = [
  { id: 'c1', author: 'Lukas', text: 'The keys lesson helped.', replies: [
    { id: 'c2', author: 'Meera', text: 'Thank you, Lukas!', replies: [
      { id: 'c3', author: 'Lukas', text: 'Loved the demo.', replies: [] },
    ] },
    { id: 'c4', author: 'Priya', text: 'Same here.', replies: [] },
  ] },
  { id: 'c5', author: 'Asha', text: 'Can we get the code?', replies: [] },
]

// How many replies sit below a comment, at every depth.
export const countReplies = (c: Comment): number => c.replies.reduce((n, r) => n + 1 + countReplies(r), 0)

// Returns a NEW tree with the reply added below the comment with this id. The old tree is not touched.
export function addReply(list: Comment[], parentId: string, reply: Comment): Comment[] {
  let changed = false
  const out = list.map((c) => {
    if (c.id === parentId) {
      changed = true
      return { ...c, replies: [...c.replies, reply] }
    }
    const replies = addReply(c.replies, parentId, reply)
    if (replies === c.replies) return c // nothing below changed: keep the same object
    changed = true
    return { ...c, replies }
  })
  return changed ? out : list
}
