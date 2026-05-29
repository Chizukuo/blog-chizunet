'use client';

import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

/**
 * Mermaid 图表渲染组件 — 延迟加载
 * 从 MarkdownRenderer 分离以实现 code splitting
 */
export default function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const { theme, systemTheme } = useTheme();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!mounted.current) return;

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const mermaidTheme = currentTheme === 'dark' ? 'dark' : 'default';

    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });
    
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        if (mounted.current) {
          setSvg(svg);
          setError(false);
        }
      } catch (e) {
        console.error('Mermaid render error:', e);
        if (mounted.current) {
          setError(true);
        }
      }
    };

    renderDiagram();
  }, [code, theme, systemTheme]);

  if (error) return (
    <div className="my-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
      <p className="mb-2 font-bold">Mermaid Error:</p>
      <pre className="overflow-x-auto text-xs">{code}</pre>
    </div>
  );
  
  if (!svg) return (
    <div className="my-8 flex h-32 w-full animate-pulse items-center justify-center rounded-lg bg-cheese-100/50 dark:bg-stone-800/50">
      <span className="text-sm text-cheese-600/50 dark:text-stone-500">Loading Diagram...</span>
    </div>
  );

  return <div className="mermaid my-8 flex justify-center overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
}
