import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { CourseDetail } from './CourseDetail.tsx'
import { CourseList } from './CourseList.tsx'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

test('shows the course named in the address', async () => {
  renderAt('/courses/react')
  expect(await screen.findByRole('heading')).toHaveTextContent('React for Beginners')
  expect(screen.getByText('Components as bricks')).toBeInTheDocument()
})

test('says so when the course does not exist', async () => {
  renderAt('/courses/nope')
  expect(await screen.findByText('No course with that name.')).toBeInTheDocument()
})

test('the back link goes to the course list', async () => {
  const user = userEvent.setup()
  renderAt('/courses/react')
  await user.click(await screen.findByRole('link', { name: 'Back to all courses' }))
  expect(await screen.findByRole('heading')).toHaveTextContent('Courses')
})
