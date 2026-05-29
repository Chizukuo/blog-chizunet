import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * GET /api/revalidate?secret=YOUR_TOKEN
 * On-demand revalidation endpoint to purge the cached GitHub issues list.
 * Supportsprocess.env.REVALIDATION_SECRET or falls back to GITHUB_TOKEN.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const configuredSecret = process.env.REVALIDATION_SECRET || process.env.GITHUB_TOKEN;

  if (!secret || secret !== configuredSecret) {
    return NextResponse.json({ error: 'Invalid secret token' }, { status: 401 });
  }

  try {
    revalidateTag('posts');
    return NextResponse.json({
      revalidated: true,
      tag: 'posts',
      message: 'Cache successfully purged',
      now: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
