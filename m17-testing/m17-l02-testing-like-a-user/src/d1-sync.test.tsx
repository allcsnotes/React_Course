import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('a student enrolls', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.type(screen.getByLabelText('Email'), 'lukas@example.com')
  await user.click(screen.getByRole('button', { name: /enroll now/i }))
  expect(screen.getByRole('status')).toHaveTextContent('You are enrolled')
})
