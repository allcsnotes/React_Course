import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const GOOD = { email: 'lukas@example.com', password: 'learn-fast-42' }

const course = (slug: string, title: string, price: number) => ({
  slug,
  title,
  price,
  teacher: 'Meera',
  level: 'beginner',
  free: false,
  lessonCount: 4,
})

export const handlers = [
  http.get('*/api/courses', () =>
    HttpResponse.json([
      course('react', 'React for Beginners', 499),
      course('sql', 'SQL in Two Weeks', 399),
    ]),
  ),
  http.get('*/api/me/courses', () =>
    HttpResponse.json([
      {
        slug: 'react',
        title: 'React for Beginners',
        teacher: 'Meera',
        lessonCount: 4,
        completedCount: 2,
      },
    ]),
  ),
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as typeof GOOD
    if (email === GOOD.email && password === GOOD.password) {
      const user = { id: 1, name: 'Lukas', email, role: 'student' }
      return HttpResponse.json({ accessToken: 'test-token', user })
    }
    return HttpResponse.json(
      { error: 'Wrong email or password' },
      { status: 401 },
    )
  }),
]

export const server = setupServer(...handlers)
