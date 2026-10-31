import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePageDiv } from './CoursePageDiv.tsx'

test('the page has an enroll button', () => {
  const { container } = render(<CoursePageDiv />)
  expect(container.querySelector('.btn')).toBeInTheDocument()
})
