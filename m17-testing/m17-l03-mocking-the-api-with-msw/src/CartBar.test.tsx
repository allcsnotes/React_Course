import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartBar } from './CartBar.tsx'
import { CartProvider } from './CartContext.tsx'

test('adding a course changes the cart count', async () => {
  const user = userEvent.setup()
  render(<CartBar />, { wrapper: CartProvider })
  expect(screen.getByText('Cart: 0')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /enrol/i }))
  expect(screen.getByText('Cart: 1')).toBeInTheDocument()
})
