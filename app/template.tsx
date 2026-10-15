'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Page transition template — Apple-style fluid entrance
 * Uses spring physics for natural deceleration
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        transitionEnd: {
          filter: 'none',
          transform: 'none'
        }
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // Apple's signature easing
      }}
    >
      {children}
    </motion.div>
  );
}
