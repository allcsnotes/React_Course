import { describe, expect, it } from 'vitest'
import { percent } from './progress'

describe('percent', () => {
  it('is 0 when a course has no lessons', () => {
    expect(percent(0, 0)).toBe(0)
  })
  it('rounds to a whole number', () => {
    expect(percent(2, 5)).toBe(40)
    expect(percent(1, 3)).toBe(33)
  })
  it('is 100 when every lesson is done', () => {
    expect(percent(5, 5)).toBe(100)
  })
})
