import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the email box has a label', () => {
  render(<CoursePage />)
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
})
