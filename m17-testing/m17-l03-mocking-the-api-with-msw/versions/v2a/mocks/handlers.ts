import { http, HttpResponse } from 'msw'
import { API } from '../api.ts'

const courses = [
  { slug: 'react', title: 'React for Beginners', teacher: 'Meera', lessonCount: 4 },
  { slug: 'python', title: 'Python from Zero', teacher: 'Meera', lessonCount: 3 },
  { slug: 'devops', title: 'DevOps Basics', teacher: 'Asha', lessonCount: 3 },
]

const lessons = [
  { id: 1, title: 'What React is' },
  { id: 2, title: 'Components as bricks' },
]

export const handlers = [
  http.get(`${API}/api/courses`, () => HttpResponse.json(courses)),

  http.get(`${API}/api/courses/:slug`, ({ params }) => {
    if (params.slug !== 'react') {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }
    return HttpResponse.json({ title: 'React for Beginners', lessons })
  }),
]
