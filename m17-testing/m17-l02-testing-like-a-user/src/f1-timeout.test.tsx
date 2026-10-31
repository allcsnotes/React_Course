import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('a status that never comes', async () => {
  render(<CoursePage />)
  expect(await screen.findByRole('status')).toBeInTheDocument()
})
