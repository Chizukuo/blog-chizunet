'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CheeseHoleProps {
  className?: string;
  delay?: number;
}

export default function CheeseHole({ className, delay = 0 }: CheeseHoleProps) {
  const controls = useAnimation();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const startFloating = () => {
    if (!shouldAnimate) return;

    controls.start({
      y: [0, -30, 0, -50, 0],
      x: [0, 20, 0, -20, 0],
      rotate: [0, 10, -10, 5, 0],
      transition: {
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
        times: [0, 0.2, 0.5, 0.8, 1]
      }
    });
  };

  useEffect(() => {
    if (shouldAnimate) {
      startFloating();
    }
  }, [shouldAnimate, delay]);

  return (
    <motion.div
      ref={elementRef}
      className={`absolute ${className}`}
      animate={controls}
      style={{
        zIndex: 0,
        willChange: shouldAnimate ? 'transform' : 'auto',
      }}
    >
      <motion.div
        className="w-full h-full rounded-full bg-cheese-300/40 dark:bg-cheese-500/10 backdrop-blur-md shadow-sm cursor-grab active:cursor-grabbing hover:bg-cheese-400/50 transition-colors duration-300"
        whileHover={{
          scale: 1.1,
          rotate: 15,
          transition: { type: "spring", stiffness: 400, damping: 15 }
        }}
        whileTap={{
          scale: 0.9,
          transition: { type: "spring", stiffness: 400, damping: 15 }
        }}
        drag
        dragSnapToOrigin
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 15, bounceDamping: 20 }}
        onDragStart={() => controls.stop()}
        onDragEnd={() => startFloating()}
      />
    </motion.div>
  );
}
