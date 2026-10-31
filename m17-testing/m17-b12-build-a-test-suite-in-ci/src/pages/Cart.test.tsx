import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { expect, it } from 'vitest'
import { useCartStore } from '../cart/cartStore'
import Cart from './Cart'

const react = { slug: 'r', title: 'React', price: 499 }
const sql = { slug: 's', title: 'SQL', price: 399 }

function renderCart() {
  render(
    <MemoryRouter>
      <Cart />
    </MemoryRouter>,
  )
}

it('applies a coupon typed in small letters', async () => {
  useCartStore.setState({ items: [react, sql] })
  const user = userEvent.setup()
  renderCart()

  const box = screen.getByRole('textbox', { name: /coupon/i })
  await user.type(box, 'save10')
  await user.click(screen.getByRole('button', { name: 'Apply' }))

  expect(screen.getByText('- Rs 90')).toBeInTheDocument()
  expect(screen.getByText('Rs 808')).toBeInTheDocument()
})

it('says so when the cart is empty', () => {
  renderCart()
  expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
})
