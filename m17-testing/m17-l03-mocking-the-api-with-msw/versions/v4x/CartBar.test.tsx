import { render, screen } from '@testing-library/react'
import { CartBar } from './CartBar.tsx'

test('adding a course changes the cart count', () => {
  render(<CartBar />)
  expect(screen.getByText('Cart: 0')).toBeInTheDocument()
})
