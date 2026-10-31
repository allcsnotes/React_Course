import { describe, expect, it } from 'vitest'
import { percent } from './progress'

describe('percent', () => {
  it('rounds to a whole number', () => expect(percent(1, 3)).toBe(33))
  it('is 0 for a course with no lessons', () => expect(percent(0, 0)).toBe(0))
  it('is 100 when everything is done', () => expect(percent(4, 4)).toBe(100))
})
