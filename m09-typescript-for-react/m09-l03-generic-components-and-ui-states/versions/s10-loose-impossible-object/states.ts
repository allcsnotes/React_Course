import type { Course } from './types'

export type State = {
  status: 'loading' | 'error' | 'success'
  message?: string
  courses?: Course[]
}
