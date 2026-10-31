import { courses } from '@/lib/courses'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const max = Number(searchParams.get('max') ?? Infinity)
  return Response.json(courses.filter((c) => c.price <= max))
}
