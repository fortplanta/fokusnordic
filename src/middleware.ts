import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Sets Cache-Control: no-store for Presentation preview requests so draft
 * changes are visible immediately without a hard refresh.
 *
 * Detected via:
 *   - __prerender_bypass cookie — set by Next.js when draftMode().enable() runs
 *   - sanity-preview-perspective query param — always appended by the
 *     Sanity Presentation tool when loading the preview iframe
 *
 * Regular visitor requests pass through untouched; ISR and CDN caching are
 * unaffected for them.
 */
export function middleware(request: NextRequest) {
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
  // Run on page routes only — skip _next internals, static assets, and API
  // routes (those set their own cache headers)
  matcher: ['/((?!_next/static|_next/image|favicon|api/).*)'],
}
