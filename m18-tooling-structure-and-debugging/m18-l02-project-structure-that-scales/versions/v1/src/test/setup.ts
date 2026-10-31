import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { useCartStore } from '../store/cartStore'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  useCartStore.setState({ items: [], coupon: null })
  localStorage.clear()
})
afterAll(() => server.close())
