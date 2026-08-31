import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Prevent Presentation preview requests from being cached so draft changes
 * remain visible without affecting the cached public site.
 */
export function proxy(request: NextRequest) {
  const isPreview =
    request.cookies.has('__prerender_bypass') ||
    request.nextUrl.searchParams.has('sanity-preview-perspective')

  if (!isPreview) return NextResponse.next()

  const response = NextResponse.next()
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0',
  )
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|api/).*)'],
}
