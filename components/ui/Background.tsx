'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import CheeseHole from './CheeseHole';

/**
 * 全局背景组件，包含随页面切换而变化的装饰性元素
 */
export default function Background() {
  const pathname = usePathname();
  const isHome = pathname === '/' || ['/en', '/ja', '/zh'].includes(pathname);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        initial={false}
        animate={{
          top: isHome ? '-2.5rem' : '5rem',
          left: isHome ? '-2.5rem' : 'auto',
          right: isHome ? 'auto' : '-2.5rem',
          width: isHome ? '8rem' : '8rem',
          height: isHome ? '8rem' : '8rem',
          opacity: isHome ? 1 : 0.5,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute md:w-64 md:h-64"
        style={{
        }}
      >
         <CheeseHole className="w-full h-full" delay={0} />
      </motion.div>

      <motion.div
        className="absolute"
        initial={false}
        animate={{
          top: isHome ? '-5%' : '10%',
          left: isHome ? '-5%' : '90%',
          scale: isHome ? 1 : 0.8,
          opacity: isHome ? 1 : 0.5,
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
         <div className="w-32 h-32 md:w-64 md:h-64 relative">
            <CheeseHole className="w-full h-full" delay={0} />
         </div>
      </motion.div>

      <motion.div
        className="absolute"
        initial={false}
        animate={{
          top: isHome ? '50%' : '120%',
          right: isHome ? '-5%' : '-20%',
          scale: isHome ? 1 : 0.5,
          opacity: isHome ? 1 : 0,
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-48 h-48 md:w-96 md:h-96 relative">
            <CheeseHole className="w-full h-full" delay={2} />
        </div>
      </motion.div>

      <motion.div
        className="absolute"
        initial={false}
        animate={{
          bottom: isHome ? '5rem' : '5rem',
          left: isHome ? '10%' : '2.5rem',
          scale: isHome ? 1 : 1,
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-20 h-20 md:w-32 md:h-32 relative">
            <CheeseHole className="w-full h-full" delay={1} />
        </div>
      </motion.div>
    </div>
  );
}
