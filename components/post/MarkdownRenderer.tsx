'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, Check, Terminal } from 'lucide-react';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

// Import specific languages that are not in the common set
import x86asm from 'highlight.js/lib/languages/x86asm';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import diff from 'highlight.js/lib/languages/diff';
import powershell from 'highlight.js/lib/languages/powershell';
import lua from 'highlight.js/lib/languages/lua';

// Custom Shell language definition for better tech blog highlighting
const customShell = (hljs: any) => ({
  name: 'shell',
  aliases: ['sh', 'bash', 'zsh', 'shell'],
  keywords: {
    keyword: 'npm npx yarn pnpm git docker node cargo go rustc gcc g++ make sudo cd ls cat mkdir rm cp mv chmod chown export alias source install run dev build start test',
    literal: 'true false null',
    built_in: 'break cd continue eval exec exit export getopts hash pwd readonly return set shift test times trap umask unset'
  },
  contains: [
    hljs.HASH_COMMENT_MODE,
    hljs.QUOTE_STRING_MODE,
    hljs.APOS_STRING_MODE,
    {
      className: 'meta',
      begin: /^\s*\$/,
      relevance: 0
    },
    {
      className: 'string',
      begin: /--\w+/,
      relevance: 0
    }
  ]
});

// Create lowlight instance and register languages
const lowlight = createLowlight(common);
lowlight.register('shell', customShell);
lowlight.register('bash', customShell);
lowlight.register('sh', customShell);
lowlight.register('zsh', customShell);
lowlight.register('x86asm', x86asm);
lowlight.register('masm', x86asm);
lowlight.register('asm', x86asm);
lowlight.register('c', c);
lowlight.register('cpp', cpp);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('rust', rust);
lowlight.register('go', go);
lowlight.register('sql', sql);
lowlight.register('yaml', yaml);
lowlight.register('json', json);
lowlight.register('dockerfile', dockerfile);
lowlight.register('makefile', makefile);
lowlight.register('markdown', markdown);
lowlight.register('diff', diff);
lowlight.register('powershell', powershell);
lowlight.register('lua', lua);

const allLanguages = {
  ...common,
  shell: customShell,
  bash: customShell,
  sh: customShell,
  zsh: customShell,
  x86asm,
  masm: x86asm,
  asm: x86asm,
  dockerfile,
  docker: dockerfile,
  makefile,
  powershell,
  ps: powershell,
  ps1: powershell,
  lua,
  rust,
  go,
  sql,
  yaml,
  yml: yaml,
  json,
  diff,
  markdown,
  md: markdown
};

interface MarkdownRendererProps {
  content: string;
}

import { useI18n } from '@/hooks/useI18n';
import { translations } from '@/lib/translations';

// ... existing imports ...

const CodeBlock = ({ children, className }: { children: any, className?: string }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = React.useRef<HTMLElement>(null);
  const { locale, _hasHydrated } = useI18n();
  
  const currentLocale = _hasHydrated ? locale : 'zh';
  const t = translations[currentLocale];
  
  // Extract language from className (e.g., "language-js" or "hljs language-js")
  const langMatch = className?.match(/language-(\w+)/);
  let language = langMatch ? langMatch[1] : 'text';
  
  // Friendly names for common aliases
  const langMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'sh': 'shell',
    'bash': 'shell',
    'ps': 'powershell',
    'ps1': 'powershell',
    'asm': 'assembly',
    'x86asm': 'assembly',
    'masm': 'assembly',
    'cpp': 'c++',
    'md': 'markdown'
  };
  
  const displayLanguage = langMap[language.toLowerCase()] || language;

  const onCopy = () => {
    if (codeRef.current) {
      const content = codeRef.current.innerText.replace(/\n$/, '');
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-8 overflow-hidden rounded-2xl border border-cheese-200/10 bg-stone-950/80 backdrop-blur-md dark:border-stone-800/50 dark:bg-black/60">
      <div className="flex items-center justify-between border-b border-cheese-200/10 bg-white/5 px-4 py-2 dark:border-stone-800/50">
        <div className="flex items-center gap-2 text-xs font-medium text-cheese-600/80 dark:text-cheese-400/80">
          <Terminal size={14} />
          <span className="uppercase tracking-wider">{displayLanguage}</span>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-cheese-600/60 transition-colors hover:bg-white/10 hover:text-cheese-500 dark:text-cheese-400/60 dark:hover:text-cheese-300"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-500" />
              <span>{t.copied}</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>{t.copy}</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-6 text-sm leading-relaxed">
        <code ref={codeRef} className={`${className} !bg-transparent !p-0 font-mono`}>
          {children}
        </code>
      </div>
    </div>
  );
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-cheese dark:prose-invert max-w-none notranslate">
      <ReactMarkdown
        rehypePlugins={[
          [rehypeHighlight, { 
            languages: allLanguages,
            detect: true,
            ignoreMissing: true
          }],
          rehypeKatex
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          img: ({ node, ...props }) => (
            <span className="block my-8">
              <img 
                {...props} 
                className="rounded-3xl border border-cheese-200/50 dark:border-stone-800/50 shadow-xl mx-auto max-w-full h-auto" 
                loading="lazy"
              />
              {props.alt && (
                <span className="block text-center text-sm text-cheese-900/40 dark:text-cheese-100/40 mt-3 font-medium italic">
                  {props.alt}
                </span>
              )}
            </span>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            if (isInline) {
              return (
                <code className="bg-cheese-100 dark:bg-stone-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md text-sm font-medium font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          // Custom checkbox rendering
          input: ({ node, ...props }) => {
            if (props.type === 'checkbox') {
              return (
                <input 
                  {...props} 
                  disabled={false}
                  readOnly
                  className="checkbox-custom"
                />
              );
            }
            return <input {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
