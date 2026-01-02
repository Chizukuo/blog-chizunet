import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/github';
import { Locale } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.chizunet.cc';
  const languages: Locale[] = ['zh', 'en', 'ja'];
  
  const sitemapList: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          zh: `${baseUrl}/zh`,
          en: `${baseUrl}/en`,
          ja: `${baseUrl}/ja`,
        },
      },
    }
  ];

  for (const lang of languages) {
    sitemapList.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          zh: `${baseUrl}/zh`,
          en: `${baseUrl}/en`,
          ja: `${baseUrl}/ja`,
        },
      },
    });

    const posts = await getPosts(lang);
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${lang}/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          zh: `${baseUrl}/zh/${post.slug}`,
          en: `${baseUrl}/en/${post.slug}`,
          ja: `${baseUrl}/ja/${post.slug}`,
        },
      },
    }));
    
    sitemapList.push(...postUrls);
  }

  return sitemapList;
}
