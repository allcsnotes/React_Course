import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the lessons load', () => {
  render(<CoursePage />)
  expect(screen.findByText('Variables')).toBeInTheDocument()
})
