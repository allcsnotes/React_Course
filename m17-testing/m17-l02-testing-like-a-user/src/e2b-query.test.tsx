import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('no status message before enrolling', () => {
  render(<CoursePage />)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})
