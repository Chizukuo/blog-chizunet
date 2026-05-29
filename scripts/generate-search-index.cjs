const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
// Since we are using ts-node's register hook, we can use the path alias
const { getPosts } = require('@/lib/github'); 

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const publicDir = path.join(process.cwd(), 'public');
const languages = ['zh', 'en'];

async function generateSearchIndex() {
  console.log('Generating search index...');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const lang of languages) {
    try {
      // Fetch all posts for the language.
      // The GitHub API per_page max is 100. We will fetch 10 pages to get up to 1000 posts.
      let allPosts = [];
      for (let i = 1; i <= 10; i++) {
        const posts = await getPosts(lang, i, 100);
        if (posts.length === 0) {
          break; // No more posts
        }
        allPosts.push(...posts);
      }

      const searchData = allPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        description: post.description,
        tags: post.labels.map(l => l.name),
        date: post.created_at,
      }));

      const outputPath = path.join(publicDir, `search-${lang}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));
      console.log(`✅ Successfully generated search index for [${lang}] at ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to generate search index for [${lang}]:`, error);
    }
  }

  console.log('Search index generation complete.');
}

generateSearchIndex();
