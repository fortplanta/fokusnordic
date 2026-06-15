import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

/**
 * Diagnostic endpoint — hit /api/sanity-check to verify that
 * SANITY_API_READ_TOKEN is present and capable of reading drafts.
 *
 * Returns JSON, never throws. Delete this route once the preview is working.
 */
export async function GET() {
  const token      = process.env.SANITY_API_READ_TOKEN
  const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

  const result: Record<string, unknown> = {
    tokenPresent:  !!token,
    tokenLength:   token?.length ?? 0,
    tokenPrefix:   token ? token.slice(0, 6) + '…' : null,
    projectId:     projectId ?? '(not set)',
    dataset,
    canFetchPublished: false,
    canFetchDrafts:    false,
    error:             null,
  }

  if (!projectId) {
    result.error = 'NEXT_PUBLIC_SANITY_PROJECT_ID is not set'
    return NextResponse.json(result)
  }

  // Test 1: unauthenticated published fetch
  try {
    const c = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false })
    await c.fetch('*[_type == "siteSettings"][0]._id')
    result.canFetchPublished = true
  } catch (e) {
    result.error = `Published fetch failed: ${e instanceof Error ? e.message : String(e)}`
    return NextResponse.json(result)
  }

  // Test 2: authenticated draft fetch
  if (!token) {
    result.error = 'SANITY_API_READ_TOKEN is not set — draft mode will always 500'
    return NextResponse.json(result)
  }

  try {
    const c = createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token })
    await c.fetch('*[_type == "siteSettings"][0]._id', {}, { perspective: 'drafts' })
    result.canFetchDrafts = true
  } catch (e) {
    result.error = `Draft fetch failed (token invalid or wrong permissions?): ${e instanceof Error ? e.message : String(e)}`
  }

  return NextResponse.json(result)
}
