import { useState } from 'react'
import { COMMENTS } from './data'

const count = c => c.replies.reduce((n, r) => n + 1 + count(r), 0)

function addReply(list, parentId, reply) {
  return list.map(c => c.id === parentId
    ? { ...c, replies: [...c.replies, reply] }
    : { ...c, replies: addReply(c.replies, parentId, reply) })
}

function Comment({ node, onReply }) {
  const [open, setOpen] = useState(true)
  const [replying, setReplying] = useState(false)
  const [text, setText] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onReply(node.id, text.trim())
    setText('')
    setReplying(false)
    setOpen(true)
  }

  return (
    <li className="comment">
      <p><b>{node.author}</b> {node.text}</p>
      <div className="acts">
        {node.replies.length > 0 && (
          <button aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Collapse' : `Show ${count(node)} replies`}
          </button>
        )}
        <button onClick={() => setReplying(true)}>Reply</button>
      </div>
      {replying && (
        <form onSubmit={submit}>
          <input autoFocus value={text}
            onChange={e => setText(e.target.value)} />
          <button>Send</button>
        </form>
      )}
      {open && node.replies.length > 0 && (
        <ul>
          {node.replies.map(r => (
            <Comment key={r.id} node={r} onReply={onReply} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function Comments() {
  const [list, setList] = useState(COMMENTS)

  function onReply(parentId, text) {
    const id = crypto.randomUUID()
    const reply = { id, author: 'Asha', text, replies: [] }
    setList(old => addReply(old, parentId, reply))
  }

  return (
    <ul className="comments">
      {list.map(c => (
        <Comment key={c.id} node={c} onReply={onReply} />
      ))}
    </ul>
  )
}
