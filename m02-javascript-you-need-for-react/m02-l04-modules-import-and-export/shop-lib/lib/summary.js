import courses from '../courses.js'
import { formatPrice } from './price.js'

export function summary() {
  return courses.map(c => `${c.title}: ${formatPrice(c.price)}`)
}
