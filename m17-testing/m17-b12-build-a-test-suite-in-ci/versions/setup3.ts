import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { useCartStore } from '../cart/cartStore'

afterEach(() => {
  cleanup()
  useCartStore.setState({ items: [], coupon: null })
  localStorage.clear()
})
