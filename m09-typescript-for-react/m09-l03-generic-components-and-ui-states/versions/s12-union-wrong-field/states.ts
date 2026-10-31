import type { Course } from './types'

export type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; courses: Course[] }
