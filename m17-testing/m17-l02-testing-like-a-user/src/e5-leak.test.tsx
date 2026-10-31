import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the page has an email box', () => {
  render(<CoursePage />)
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
})

test('the email box starts empty', () => {
  render(<CoursePage />)
  expect(screen.getByLabelText('Email')).toHaveValue('')
})
