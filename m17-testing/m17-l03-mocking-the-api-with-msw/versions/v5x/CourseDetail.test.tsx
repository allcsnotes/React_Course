import { render, screen } from '@testing-library/react'
import { CourseDetail } from './CourseDetail.tsx'

test('shows the course named in the address', async () => {
  render(<CourseDetail />)
  expect(await screen.findByRole('heading')).toHaveTextContent('React for Beginners')
})
