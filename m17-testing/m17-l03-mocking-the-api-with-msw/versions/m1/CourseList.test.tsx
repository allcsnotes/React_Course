import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { API } from './api.ts'
import { CourseList } from './CourseList.tsx'
import { server } from './mocks/server.ts'

test('shows a message when the server fails', async () => {
  server.use(http.get(`${API}/api/courses`, () => new HttpResponse(null, { status: 500 })))
  render(<CourseList />)
  expect(await screen.findByText('Could not load courses.')).toBeInTheDocument()
})

test('shows the courses from the API', async () => {
  render(<CourseList />)
  expect(await screen.findByText('React for Beginners')).toBeInTheDocument()
})
