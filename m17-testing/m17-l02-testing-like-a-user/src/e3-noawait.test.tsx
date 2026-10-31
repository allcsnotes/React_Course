import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('a student saves the course', () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  user.click(screen.getByRole('button', { name: 'Save course' }))
  expect(screen.getByRole('button', { name: 'Saved' })).toBeInTheDocument()
})
