import { render, screen } from '@testing-library/react'
import { CourseList } from './CourseList.tsx'

test('shows the courses from the API', async () => {
  render(<CourseList />)
  expect(await screen.findByText('React for Beginners')).toBeInTheDocument()
})
