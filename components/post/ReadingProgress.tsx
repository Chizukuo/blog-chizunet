'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(scrolled / total, 1) : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (reduceMotion) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-cheese-400 via-cheese-500 to-cheese-600"
        style={{ transform: `scaleX(${progress})` }}
      />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-cheese-400 via-cheese-500 to-cheese-600 shadow-sm shadow-cheese-500/40"
      style={{ scaleX: progress }}
    />
  );
}
