import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CourseCard from './CourseCard'

const course = { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 }

test('calls onAdd when Add to cart is pressed', async () => {
  const onAdd = vi.fn()
  render(<CourseCard course={course} inCart={false} onAdd={onAdd} />)
  await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }))
  expect(onAdd).toHaveBeenCalledWith(course)
})

test('shows In cart when the course is already in the cart', () => {
  render(<CourseCard course={course} inCart={true} onAdd={() => {}} />)
  expect(screen.getByRole('button', { name: 'In cart' }).hasAttribute('disabled')).toBe(true)
})
