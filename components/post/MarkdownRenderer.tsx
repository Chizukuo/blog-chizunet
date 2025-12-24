'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { Copy, Check, Terminal, ChevronRight } from 'lucide-react';
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
      begin: /^\s*$/,
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
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { 
            languages: allLanguages,
            detect: true,
            ignoreMissing: true
          }],
          rehypeKatex
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          h1: ({ node, ...props }) => <h1 {...props} className="scroll-mt-32 text-4xl font-black text-stone-900 dark:text-stone-50 mb-8 mt-12 tracking-tight" />,
          h2: ({ node, ...props }) => <h2 {...props} className="scroll-mt-32 text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6 mt-10 tracking-tight border-b border-cheese-200/50 dark:border-stone-800/50 pb-2" />,
          h3: ({ node, ...props }) => <h3 {...props} className="scroll-mt-32 text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 mt-8" />,
          h4: ({ node, ...props }) => <h4 {...props} className="scroll-mt-32 text-xl font-bold text-stone-800 dark:text-stone-200 mb-3 mt-6" />,
          h5: ({ node, ...props }) => <h5 {...props} className="scroll-mt-32 text-lg font-bold text-stone-800 dark:text-stone-200 mb-2 mt-4" />,
          h6: ({ node, ...props }) => <h6 {...props} className="scroll-mt-32 text-base font-bold text-stone-800 dark:text-stone-200 mb-2 mt-4 uppercase tracking-wider" />,
          p: ({ node, ...props }) => <p {...props} className="mb-6 leading-relaxed text-stone-700 dark:text-stone-300" />,
          ul: ({ node, ...props }) => <ul {...props} className="my-6 ml-6 list-disc marker:text-cheese-500 dark:marker:text-cheese-600 space-y-2 text-stone-700 dark:text-stone-300" />,
          ol: ({ node, ...props }) => <ol {...props} className="my-6 ml-6 list-decimal marker:text-cheese-500 dark:marker:text-cheese-600 space-y-2 font-medium text-stone-700 dark:text-stone-300" />,
          li: ({ node, ...props }) => <li {...props} className="pl-2" />,
          hr: ({ node, ...props }) => <hr {...props} className="my-12 border-stone-300 dark:border-stone-700" />,
          strong: ({ node, ...props }) => <strong {...props} className="font-bold text-stone-900 dark:text-stone-50" />,
          a: ({ node, ...props }) => {
            // Check if it's an internal anchor link
            const isAnchor = props.href?.startsWith('#');
            // Check if it's a relative link (internal)
            const isRelative = props.href?.startsWith('/');
            
            const linkProps = (isAnchor || isRelative)
              ? {} 
              : { target: "_blank", rel: "noopener noreferrer" };
            
            return (
              <a 
                {...props} 
                {...linkProps} 
                className="text-amber-600 dark:text-amber-400 no-underline hover:underline font-medium break-words transition-colors hover:text-amber-700 dark:hover:text-amber-300 underline-offset-4 decoration-amber-500 dark:decoration-amber-400 decoration-2" 
              />
            );
          },
          img: ({ node, ...props }) => (
            <span className="block my-8">
              <img 
                {...props} 
                className="rounded-3xl border border-cheese-200/50 dark:border-stone-800/50 shadow-xl mx-auto max-w-full h-auto" 
                loading="lazy"
              />
              {props.alt && (
                <span className="block text-center text-sm text-stone-500 dark:text-stone-400 mt-3 font-medium italic">
                  {props.alt}
                </span>
              )}
            </span>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote {...props} className="border-l-4 border-cheese-500 bg-cheese-50/50 dark:bg-stone-800/30 px-6 py-4 rounded-r-xl italic not-italic text-stone-700 dark:text-stone-300 shadow-sm my-6" />
          ),
          table: ({ node, ...props }) => (
            <div className="my-6 w-full overflow-hidden rounded-lg border border-cheese-300 dark:border-stone-700 shadow-sm bg-white dark:bg-stone-900/50">
              <div className="overflow-x-auto">
                <table {...props} className="w-full text-left text-sm border-collapse !my-0" />
              </div>
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} className="bg-cheese-100/80 dark:bg-stone-800 border-b border-cheese-300 dark:border-stone-700" />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} className="border-b border-cheese-200/60 dark:border-stone-800 last:border-none hover:bg-cheese-50 dark:hover:bg-stone-800/50 transition-colors" />
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="px-4 py-3 font-bold text-stone-900 dark:text-stone-50 whitespace-nowrap" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-4 py-2.5 text-stone-700 dark:text-stone-300 leading-snug min-w-[120px]" />
          ),
          details: ({ node, ...props }) => (
            <details 
              {...props} 
              className="group my-6 rounded-xl border border-cheese-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm overflow-hidden [&>*:not(summary)]:px-6 [&>*:not(summary)]:last:pb-6" 
            />
          ),
          summary: ({ node, ...props }) => (
            <summary 
              {...props} 
              className="cursor-pointer px-6 py-4 font-bold text-stone-800 dark:text-stone-100 flex items-center justify-between select-none bg-cheese-50/50 dark:bg-stone-800/30 hover:bg-cheese-100/50 dark:hover:bg-stone-800/50 transition-colors [&::-webkit-details-marker]:hidden list-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cheese-400"
            >
              <span className="flex items-center gap-3">
                <div className="text-cheese-500 dark:text-stone-500 transition-transform duration-300 group-open:rotate-90">
                  <ChevronRight size={20} />
                </div>
                {props.children}
              </span>
            </summary>
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