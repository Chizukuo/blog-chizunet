# Chizunet Blog 设计规范

博客（blog.chizunet.cc）与主站（chizunet.cc）共用一套设计语言。**色彩、字体、形状、动效等基础规范以主站 [`chizunet-main/DESIGN.md`](https://github.com/Chizukuo/chizunet-main/blob/main/DESIGN.md) 为准**；本文档列出两站共享的令牌，以及博客特有的布局、组件和交互约定。

令牌定义在 `tailwind.config.ts`，全局样式与可复用类在 `styles/globals.css`。修改共享令牌时，请同步主站的 `tailwind.config.js` 与两份文档。

## 1. 共享令牌（与主站保持一致）

| 类别 | 令牌 | 说明 |
| --- | --- | --- |
| 品牌色阶 | `cheese-50` … `cheese-950` | 色值与用途同主站；`cheese-950` 是唯一的深色文字色 |
| 暗色中性色 | `stone-*` | 页面背景 `stone-950`、卡片 `stone-800/900` |
| 字体 | `font-sans`（Outfit + CJK 回退）、`font-mono`（JetBrains Mono） | 博客额外使用等宽字体显示代码 |
| 圆角 | `rounded-card`（2rem）、`rounded-avatar`（3rem） | 主站同名令牌 |
| 主题过渡 | `.theme-transition` = `transition-colors duration-theme(700ms) ease-theme` | 所有随明暗主题变色的元素统一使用 |
| 图标按钮 | `.icon-btn` | 导航栏图标按钮，定义与主站一致 |

### 博客特有令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `rounded-panel` | 2.5rem | 大面板：正文容器、搜索框、空状态、关于页卡片 |
| `ease-theme-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 带回弹，只用于缩放 / 位移（Logo、图片放大），**不要用于颜色过渡** |

### 颜色使用规则

- 只用令牌（`cheese-*`、`stone-*`、`white`）；CSS 里用 `theme('colors.cheese.600 / 12%')`，任意值类里用 `shadow-[0_0_20px_theme(colors.cheese.600/15%)]`，不写裸十六进制 / `rgba()`。
- 唯一例外是只接受字符串色值的第三方 API（`viewport.themeColor`、`NextTopLoader`），需在行尾注明对应令牌。
- 文字对比度规则同主站 §2.3：`cheese-500`～`cheese-900` 在浅色背景上只用于图标、装饰和大号展示文字。

## 2. 布局

| 区域 | 规格 |
| --- | --- |
| 页面容器 | `max-w-[120rem]`，`sm:px-6 lg:px-8`（移动端由各页面自带 `px-4`） |
| 首页文章网格 | `md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`，首篇有封面时横跨两列（featured） |
| 文章页 | 正文 `max-w-5xl 2xl:max-w-7xl`；`xl` 起右侧 240px 粘性目录 |
| 归档 / 标签页 | `max-w-3xl` 单列时间线 |
| 固定元素 | 导航栏 `z-50`（向下滚动隐藏、向上显示）；阅读进度条 `z-[60]`；返回顶部 / 移动端目录按钮 `z-40`，位于右下角 |
| 锚点偏移 | `scroll-padding-top` / `scroll-margin-top` = 8rem，避开固定导航栏 |

## 3. 组件约定

### 文章卡片 `PostCard`

- 整张卡片可点击，靠一层**真实的 `<a>` 覆盖层**实现（`absolute inset-0`，`tabIndex={-1}`、`aria-hidden`）。不要再用 `role="link"` + `router.push`，那样不支持 ⌘/Ctrl+点击新标签页打开、右键复制链接。
- 内容层 `pointer-events-none`，标题链接和标签链接 `pointer-events-auto`。键盘焦点只落在标题链接和标签上。
- 卡片背景 `bg-white/80`（暗色 `stone-800/40`），`rounded-2xl sm:rounded-card`。

### 搜索 `SearchModal`

- ⌘K / Ctrl+K 打开；索引 `public/search-{zh,en,ja}.json` 在构建时生成（`scripts/generate-search-index.cjs`），**新增语言时要同时加到脚本里**。
- 每种语言一份索引，切换语言后重新加载；推荐标签取自当前语言最常用的标签，没有标签时不显示。
- 底部快捷键提示与占位文字都走 `lib/translations.ts`。

### 正文 `MarkdownRenderer`

- 段落中含图片时渲染为 `<div>`：图片放大组件会输出 `<div>`，嵌在 `<p>` 里会导致水合错误，整篇文章被迫在客户端重渲染。
- 代码块、任务列表复选框（`.checkbox-custom`）、脚注样式见 `globals.css`。

### 其他

- 空状态 `EmptyState`：服务端组件使用时**不要传 `icon` 组件**（服务端不能把函数组件传给客户端组件，会导致该页预渲染失败），用默认图标即可。
- 图标按钮使用 `.icon-btn`，尺寸 `h-10 w-10`，图标 18px；移动端菜单按钮 `h-11 w-11`。

## 4. 多语言

- **URL 是语言的唯一来源**：组件一律用 `useLocale()`（`hooks/useLocale.ts`）取语言，再查 `translations[locale]`，不要直接读 `useI18n()` 里的持久化语言，否则从搜索引擎进入 `/en/...` 的访客会看到中文界面。
- `LocaleSync`（挂在根布局）负责把 URL 语言写回持久化 store，并更新 `<html lang>`。根布局拿不到 `[lang]` 参数，`<head>` 里有一段内联脚本在首帧前按 URL 修正 `lang`，避免英文 / 日文页先套用中文排版再跳变。
- 切换语言用 `switchLocalePath()`，保留当前子路径（`/zh/tags/react` → `/en/tags/react`）。
- 文章页数据（正文、上一篇 / 下一篇、相关文章、系列）全部由服务端按 URL 语言获取，客户端不再重复请求。

### 排版规则（`styles/globals.css`）

| 语言 | 规则 | 作用范围 |
| --- | --- | --- |
| 中 / 日 | `palt` 标点挤压 | 全站 |
| 中 / 日 | 段落行高 1.9、字距 0.05em | 全站 `p, li` |
| 中 / 日 | 标题行高 1.4、`keep-all` 断行、字重 700 | 全站标题 |
| 中 / 日 | 两端对齐、段落间距 1.5em、标题上下间距 | **仅 `.prose` 正文** |
| 英文 | 默认行高 1.6（设在 `html` 上，可被工具类覆盖）、段落自动连字符 | 全站 |

两端对齐和段落 / 标题间距只作用于正文。之前作用于全站时，卡片标题、归档页标题会被撑出大段空白，居中的标题也会变成左对齐。

## 5. 动效与可访问性

- **减少动态效果**：根 Provider 里设置了 `<MotionConfig reducedMotion="user">`，系统开启"减少动态效果"时，Framer Motion 自动跳过位移 / 缩放，只保留透明度过渡。
  - **不要**写 `animate={reduceMotion ? undefined : {...}}`：服务端渲染会输出 `initial` 的 `opacity: 0`，客户端又不再执行动画，内容会一直不可见。
  - 需要关闭 CSS 动画时，全局的 `prefers-reduced-motion` 规则已统一处理。
- **触控目标**：小屏下按钮 / 链接最小 44×44px（`.prose` 正文里的行内链接除外）。
- **键盘焦点**：全局 `:focus-visible` 为 3px `cheese-500` 描边；跳转到正文的 Skip link 位于根布局。
- 页面切换：`app/template.tsx` 淡入 + 轻微上移 + 模糊消失，0.4s。

## 6. 已知问题

1. **文字对比度**：与主站相同，亮黄 / 橙色文字（元信息、标签、`text-cheese-900/40` 等半透明文字）低于 WCAG AA。
2. **服务端 `<html lang>` 恒为 `zh`**：已用内联脚本在首帧前修正，但不执行 JS 的爬虫看到的仍是 `zh`；彻底解决需要把 `<html>` 移到 `app/[lang]/layout.tsx`。
3. **同一 slug 的跨语言文章**：切换语言时直接跳到同 slug 的另一语言版本，若该语言没有对应文章会进入 404。
