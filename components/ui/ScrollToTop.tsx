'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={scrollToTop}
          aria-label="回到顶部"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 flex items-center justify-center rounded-full bg-cheese-500 hover:bg-cheese-600 text-white shadow-lg shadow-cheese-500/30 hover:shadow-cheese-600/30 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cheese-500 focus-visible:ring-offset-2"
          whileHover={reduceMotion ? undefined : { scale: 1.1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
