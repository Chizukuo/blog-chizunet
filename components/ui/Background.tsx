'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import CheeseHole from './CheeseHole';

export default function Background() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Define positions for Home and Post pages
  // We can use variants to animate between them
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Hole 1: Top Left */}
      <motion.div
        initial={false}
        animate={{
          top: isHome ? '-2.5rem' : '5rem', // -top-10 vs top-20
          left: isHome ? '-2.5rem' : 'auto', // -left-10 vs auto
          right: isHome ? 'auto' : '-2.5rem', // auto vs -right-10
          width: isHome ? '8rem' : '8rem', // w-32
          height: isHome ? '8rem' : '8rem', // h-32
          opacity: isHome ? 1 : 0.5,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // Custom ease for smooth transition
        className="absolute md:w-64 md:h-64" // Keep md classes for responsiveness base, but animate inline styles
        style={{
            // We need to handle responsive values via media queries or just animate generic values
            // For simplicity, let's animate percentage or rem based positions
        }}
      >
         {/* 
            Since framer-motion animating classes is tricky, we'll wrap CheeseHole in a motion.div 
            and animate the position properties.
            
            Home Config:
            1. w-32 h-32 md:w-64 md:h-64 -top-10 -left-10 md:-top-20 md:-left-20
            2. w-48 h-48 md:w-96 md:h-96 top-1/2 -right-10 md:-right-20
            3. w-20 h-20 md:w-32 md:h-32 bottom-20 left-10 md:left-1/4

            Post Config:
            1. w-32 h-32 md:w-64 md:h-64 top-20 -right-10 opacity-50
            2. w-20 h-20 md:w-32 md:h-32 bottom-20 left-10
         */}
         <CheeseHole className="w-full h-full" delay={0} />
      </motion.div>

      {/* Re-implementing with absolute positioning controlled by motion */}
      
      {/* Hole 1: Home(Top-Left) -> Post(Top-Right) */}
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

      {/* Hole 2: Home(Right-Center) -> Post(Gone/Hidden or moved away) */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          top: isHome ? '50%' : '120%', // Move off screen for post
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

      {/* Hole 3: Home(Bottom-Left) -> Post(Bottom-Left) */}
      <motion.div
        className="absolute"
        initial={false}
        animate={{
          bottom: isHome ? '5rem' : '5rem',
          left: isHome ? '10%' : '2.5rem', // left-10 vs left-10 (approx)
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
