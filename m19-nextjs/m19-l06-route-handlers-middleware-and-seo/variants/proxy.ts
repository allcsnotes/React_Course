import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/old-courses') {
    return NextResponse.redirect(
      new URL('/courses', request.url),
    )
  }
  const response = NextResponse.next()
  response.headers.set('x-seen-by', 'proxy')
  return response
}

export const config = {
  matcher: ['/old-courses', '/courses/:path*'],
}
