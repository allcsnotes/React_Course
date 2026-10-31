import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the page has a button', () => {
  render(<CoursePage />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
