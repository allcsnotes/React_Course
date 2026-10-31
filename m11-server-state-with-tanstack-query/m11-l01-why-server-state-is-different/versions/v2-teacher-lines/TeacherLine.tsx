import { useFetch } from './useFetch'
import type { Teacher } from './types'

export function TeacherLine({ name }: { name: string }) {
  const url = '/api/teachers/' + name
  const { data } = useFetch<Teacher>(url)
  const text = data ? data.courses + ' courses' : '...'
  return <span>{name} · {text}</span>
}
