import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/server'

async function logIn(user: UserEvent, password: string) {
  const email = screen.getByLabelText('Email')
  await user.type(email, 'lukas@example.com')
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Log in' }))
}

it('shows the message for a wrong password', async () => {
  const { user } = renderApp('/login')
  await logIn(user, 'nope')

  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent('Wrong email or password')
})

it('shows the courses of the student', async () => {
  const { user } = renderApp('/login')
  await logIn(user, 'learn-fast-42')

  expect(
    await screen.findByRole('heading', { name: 'Welcome, Lukas' }),
  ).toBeInTheDocument()
  expect(
    await screen.findByText('React for Beginners'),
  ).toBeInTheDocument()
})

it('sends a visitor to the login page', () => {
  renderApp('/my-courses')
  expect(
    screen.getByRole('heading', { name: 'Log in' }),
  ).toBeInTheDocument()
})

it('says so when the network fails', async () => {
  server.use(
    http.post('*/api/auth/login', () => HttpResponse.error()),
  )
  const { user } = renderApp('/login')
  await logIn(user, 'learn-fast-42')

  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent('Something went wrong')
})
