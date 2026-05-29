import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/github';
import { Locale } from '@/types';

export const revalidate = 60;

/**
 * GET /api/posts?lang=zh&page=1&perPage=12
 * Returns paginated posts for infinite scroll
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lang = (searchParams.get('lang') as Locale) || 'zh';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('perPage') || '12', 10)));

  if (!['zh', 'en', 'ja'].includes(lang)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }

  try {
    const posts = await getPosts(lang, page, perPage);

    return NextResponse.json(
      { posts, page, perPage, hasMore: posts.length >= perPage },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('API /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
