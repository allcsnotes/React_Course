import { render, screen } from '@testing-library/react'
import { CourseList } from './CourseList.tsx'

test('shows the courses from the API', async () => {
  render(<CourseList />)
  expect(await screen.findByText('React for Beginners')).toBeInTheDocument()
})

test('shows exactly the three mock courses', async () => {
  render(<CourseList />)
  expect(screen.getByText('Loading courses...')).toBeInTheDocument()
  expect(await screen.findAllByRole('listitem')).toHaveLength(3)
})
