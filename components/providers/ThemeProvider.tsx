'use client';

import { MotionConfig } from 'framer-motion';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

/**
 * 全局 Provider：主题 + 动效偏好
 * MotionConfig reducedMotion="user"：系统开启"减少动态效果"时，Framer Motion 自动跳过
 * 位移 / 缩放等变换动画，只保留透明度过渡。组件里不要再用 `reduceMotion ? undefined : …`
 * 关闭 animate，否则服务端渲染出的初始透明度会停留在 0，内容不可见。
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
