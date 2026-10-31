import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the page has a heading and an enroll button', () => {
  render(<CoursePage />)
  expect(screen.getByRole('heading', { name: 'Python from Zero' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /enroll now/i })).toBeInTheDocument()
})
