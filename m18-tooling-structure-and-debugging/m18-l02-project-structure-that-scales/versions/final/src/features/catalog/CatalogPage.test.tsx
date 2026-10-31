import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { expect, it } from 'vitest'
import { renderApp } from '@/test/renderApp'
import { server } from '@/test/server'

it('lists the courses and adds one to the cart', async () => {
  const { user } = renderApp('/')

  const title = await screen.findByRole('heading', {
    name: 'React for Beginners',
  })
  const card = title.closest('article')!
  const cart = screen.getByRole('link', { name: 'Cart 0' })
  expect(cart).toBeInTheDocument()

  await user.click(
    within(card).getByRole('button', { name: 'Add to cart' }),
  )

  const added = within(card).getByRole('button', { name: 'In cart' })
  expect(added).toBeDisabled()
  expect(screen.getByRole('link', { name: 'Cart 1' })).toBeInTheDocument()
})

it('shows a message when the server is down', async () => {
  server.use(
    http.get('*/api/courses', () => HttpResponse.error()),
  )
  renderApp('/')

  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent('Could not load the courses')
})
