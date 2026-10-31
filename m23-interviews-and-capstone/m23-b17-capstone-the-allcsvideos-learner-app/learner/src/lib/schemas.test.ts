import { describe, expect, it } from 'vitest'
import { feedbackSchema } from './schemas'

const good = { email: 'lukas@example.test', rating: 4, message: 'Very clear lessons.' }

describe('feedbackSchema', () => {
  it('accepts a good message', () => {
    expect(feedbackSchema.safeParse(good).success).toBe(true)
  })
  it('rejects a short message with our text', () => {
    const r = feedbackSchema.safeParse({ ...good, message: 'Nice' })
    expect(r.success ? '' : r.error.issues[0].message).toBe(
      'Write at least 10 characters',
    )
  })
  it('rejects a rating of 6', () => {
    expect(feedbackSchema.safeParse({ ...good, rating: 6 }).success).toBe(false)
  })
})
