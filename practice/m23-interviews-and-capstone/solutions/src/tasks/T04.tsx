import { useState, type FormEvent } from 'react'
import { addReply, COMMENTS, countReplies, type Comment as CommentType } from '../lib/comments.ts'

function Comment({ node, onReply }: { node: CommentType; onReply: (parentId: string, text: string) => void }) {
  const [open, setOpen] = useState(true)
  const [replying, setReplying] = useState(false)
  const [text, setText] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return // empty reply: do nothing
    onReply(node.id, text.trim())
    setText('')
    setReplying(false)
    setOpen(true)
  }

  return (
    <li className="comment">
      <p><b>{node.author}</b> {node.text}</p>
      <div>
        {node.replies.length > 0 && (
          <button aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Collapse' : `Show ${countReplies(node)} replies`}
          </button>
        )}
        <button onClick={() => setReplying(true)}>Reply</button>
      </div>
      {replying && (
        <form onSubmit={submit}>
          <input type="text" autoFocus aria-label={`Reply to ${node.author}`} value={text} onChange={(e) => setText(e.target.value)} />
          <button>Send</button>
        </form>
      )}
      {open && node.replies.length > 0 && (
        <ul>
          {node.replies.map((r) => (
            <Comment key={r.id} node={r} onReply={onReply} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function T04() {
  const [list, setList] = useState<CommentType[]>(COMMENTS)
  function onReply(parentId: string, text: string) {
    const reply: CommentType = { id: crypto.randomUUID(), author: 'Asha', text, replies: [] }
    setList((old) => addReply(old, parentId, reply))
  }
  return (
    <div>
      <button onClick={() => setList([])}>Clear all comments</button>
      {list.length === 0 ? (
        <p className="muted">No comments yet</p>
      ) : (
        <ul className="comments">
          {list.map((c) => (
            <Comment key={c.id} node={c} onReply={onReply} />
          ))}
        </ul>
      )}
    </div>
  )
}
