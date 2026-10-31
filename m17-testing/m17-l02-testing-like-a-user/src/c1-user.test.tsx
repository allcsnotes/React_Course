import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('a student saves the course', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.click(screen.getByRole('button', { name: 'Save course' }))
  expect(screen.getByRole('button', { name: 'Saved', pressed: true })).toBeInTheDocument()
})

test('a student types an email', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.type(screen.getByLabelText('Email'), 'lukas@example.com')
  expect(screen.getByLabelText('Email')).toHaveValue('lukas@example.com')
})
