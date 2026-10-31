import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the page has an enroll button', () => {
  render(<CoursePage />)
  expect(screen.getByRole('button', { name: 'Enroll now' })).toBeInTheDocument()
})
