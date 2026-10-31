'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { postReview } from '@/app/actions'

export function ReviewForm() {
  const [state, formAction] = useActionState(postReview, {})
  const { pending } = useFormStatus()
  return (
    <form action={formAction} className="card">
      <h2>Write a review</h2>
      <label htmlFor="name">Your name</label>
      <input id="name" name="name" defaultValue={state.name} />
      <label htmlFor="text">Your review</label>
      <textarea id="text" name="text" defaultValue={state.text} />
      <button type="submit" disabled={pending}>
        {pending ? 'Posting…' : 'Post review'}
      </button>
      {state.error && <p className="err">{state.error}</p>}
      {state.ok && <p className="ok">{state.ok}</p>}
    </form>
  )
}
