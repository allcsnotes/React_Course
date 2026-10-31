import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the page has an enroll button', () => {
  const { container } = render(<CoursePage />)
  expect(container.querySelector('.btn')).toBeInTheDocument()
})
