import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CourseCard } from './CourseCard'

const course = {
  id: 1,
  title: 'React from Zero',
  priceCents: 4990,
  percentOff: 20,
  seatsLeft: 12,
}

test('shows the title, the price and an Enroll button', () => {
  render(<CourseCard course={course} />)
  expect(screen.getByText('React from Zero')).toBeInTheDocument()
  expect(screen.getByText('$49.90')).toBeInTheDocument()
  expect(screen.getByText('Enroll')).toBeInTheDocument()
})

test('a sold-out course has a disabled button', () => {
  render(<CourseCard course={{ ...course, seatsLeft: 0 }} />)
  expect(screen.getByText('Sold out')).toBeDisabled()
})
