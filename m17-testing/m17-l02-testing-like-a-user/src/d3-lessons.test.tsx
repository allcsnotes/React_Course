import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { expect, test } from 'vitest'
import { CoursePage } from './CoursePage.tsx'

test('the lessons load', async () => {
  render(<CoursePage />)
  expect(screen.getByText('Loading lessons…')).toBeInTheDocument()
  await waitForElementToBeRemoved(() => screen.queryByText('Loading lessons…'))
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
  expect(screen.getByText('Variables')).toBeInTheDocument()
})
