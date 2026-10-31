import { renderHook, waitFor } from '@testing-library/react'
import { useCourses } from './useCourses.ts'

test('useCourses goes from loading to success', async () => {
  const { result } = renderHook(() => useCourses())
  expect(result.current.status).toBe('loading')
  await waitFor(() => expect(result.current.status).toBe('success'))
  expect(result.current.courses).toHaveLength(3)
})
