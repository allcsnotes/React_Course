import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePageDiv } from './CoursePageDiv.tsx'

test('the page has an enroll button', () => {
  render(<CoursePageDiv />)
  expect(screen.getByRole('button', { name: /enroll now/i })).toBeInTheDocument()
})
