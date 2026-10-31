import { findCourse } from '@/lib/courses'

export async function GET(
  _request: Request,
  ctx: RouteContext<'/api/courses/[slug]'>,
) {
  const { slug } = await ctx.params
  const course = findCourse(slug)
  if (!course) {
    return Response.json(
      { error: 'Course not found' },
      { status: 404 },
    )
  }
  return Response.json(course)
}
