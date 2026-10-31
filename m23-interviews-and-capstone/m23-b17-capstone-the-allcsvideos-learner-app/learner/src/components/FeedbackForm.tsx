'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { sendFeedback } from '@/app/actions'
import { feedbackSchema, type Feedback } from '@/lib/schemas'

type Result = { ok: boolean; error?: string }
type Props = { onSend?: (values: Feedback) => Promise<Result> }

export default function FeedbackForm({ onSend = sendFeedback }: Props) {
  const [status, setStatus] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Feedback>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { email: '', rating: 5, message: '' },
  })
  async function submit(values: Feedback) {
    const r = await onSend(values)
    setStatus(r.ok ? 'Thank you! Your feedback was sent.' : (r.error ?? 'Failed'))
    if (r.ok) reset()
  }
  return (
    <form onSubmit={handleSubmit(submit)} className="form" noValidate>
      <h2>Tell us how the course is going</h2>
      <label>
        Email
        <input
          type="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
      </label>
      {errors.email && (
        <p className="error" role="alert">
          {errors.email.message}
        </p>
      )}
      <label>
        Rating (1 to 5)
        <input
          type="number"
          min={1}
          max={5}
          aria-invalid={!!errors.rating}
          {...register('rating', { valueAsNumber: true })}
        />
      </label>
      {errors.rating && (
        <p className="error" role="alert">
          {errors.rating.message}
        </p>
      )}
      <label>
        Message
        <textarea
          rows={3}
          aria-invalid={!!errors.message}
          {...register('message')}
        />
      </label>
      {errors.message && (
        <p className="error" role="alert">
          {errors.message.message}
        </p>
      )}
      <button className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send feedback'}
      </button>
      {status && <p className="ok" role="status">{status}</p>}
    </form>
  )
}
