export async function POST(request: Request) {
  const body = await request.json()
  if (!body.email || !body.course) {
    return Response.json(
      { error: 'email and course are required' },
      { status: 400 },
    )
  }
  return Response.json(
    { ok: true, enrolled: body.course },
    { status: 201 },
  )
}
