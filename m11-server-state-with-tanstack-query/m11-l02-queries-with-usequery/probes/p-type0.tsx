import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export default function Probe() {
  const { data } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  const n: number = data
  return <p>{n}</p>
}
