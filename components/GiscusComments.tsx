'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes'; // If using next-themes, otherwise just default or check system
import { useEffect, useState } from 'react';

export default function GiscusComments() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
      <Giscus
        id="comments"
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO as any}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
