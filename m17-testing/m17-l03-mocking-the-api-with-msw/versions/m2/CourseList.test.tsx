import { render, screen } from '@testing-library/react'
import { CourseList } from './CourseList.tsx'

test('shows the courses from the API', () => {
  render(<CourseList />)
  expect(screen.getByText('React for Beginners')).toBeInTheDocument()
})
