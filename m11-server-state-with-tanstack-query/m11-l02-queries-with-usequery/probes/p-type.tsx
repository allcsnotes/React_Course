import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export default function Probe() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  if (isPending) return null
  if (isError) return null
  const n: number = data
  return <p>{n}</p>
}
