'use client';

import Link from 'next/link';
import { Github, Mail, Moon, Sun, Monitor, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const modes = ['light', 'dark', 'system'];
    const nextIndex = (modes.indexOf(theme || 'system') + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor size={20} />;
    switch (theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-sm transition-colors duration-700 ease-theme">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-black tracking-tighter text-cheese-600 dark:text-cheese-500 transition-colors duration-700 ease-theme"
      >
        <Link href="/">
          CHIZUNET<span className="text-cheese-950 dark:text-cheese-100 transition-colors duration-700 ease-theme">.BLOG</span>
        </Link>
      </motion.div>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={cycleTheme}
          className="p-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-700 ease-theme text-cheese-800 dark:text-cheese-200 relative group"
        >
          {getThemeIcon()}
        </motion.button>

        {[
          { Icon: Github, href: `https://github.com/${process.env.NEXT_PUBLIC_REPO_OWNER || 'Chizukuo'}` },
          { Icon: Mail, href: "mailto:chizukuo@icloud.com" }
        ].map(({ Icon, href }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/50 dark:bg-stone-800/50 rounded-xl hover:bg-cheese-200 dark:hover:bg-stone-700 transition-colors duration-700 ease-theme text-cheese-800 dark:text-cheese-200"
          >
            <Icon size={20} />
          </motion.a>
        ))}
      </div>
    </nav>
  );
}
