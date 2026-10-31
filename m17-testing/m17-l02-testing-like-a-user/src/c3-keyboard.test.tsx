import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the keyboard can save the course', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.tab()
  expect(screen.getByRole('button', { name: 'Save course' })).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: 'Saved', pressed: true })).toBeInTheDocument()
})
