import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server.ts'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterAll(() => server.close())
