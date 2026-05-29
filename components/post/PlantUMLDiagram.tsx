'use client';

import { useState, useEffect } from 'react';
import plantumlEncoder from 'plantuml-encoder';

/**
 * PlantUML 图表渲染组件 — 延迟加载
 * 从 MarkdownRenderer 分离以实现 code splitting
 */
export default function PlantUMLDiagram({ code }: { code: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    try {
      const encoded = plantumlEncoder.encode(code.trim());
      setUrl(`https://www.plantuml.com/plantuml/svg/${encoded}`);
    } catch (e) {
      console.error('PlantUML encode error:', e);
    }
  }, [code]);

  if (!url) return null;

  return (
    <div className="my-8 flex justify-center overflow-x-auto bg-white p-4 dark:bg-white/5 rounded-lg">
      <img src={url} alt="PlantUML Diagram" className="max-w-full h-auto dark:invert-[.85]" loading="lazy" />
    </div>
  );
}
