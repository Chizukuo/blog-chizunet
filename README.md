# Chizunet 博客

**一个基于 Next.js + Tailwind + TypeScript 的静态风格博客模板，文章通过 GitHub Issues 管理（支持多语言、KaTeX、代码高亮及 Giscus 评论）** ✅

---

## ✨ 特性

- 使用 **Next.js 14 (app router)** + **TypeScript** + **Tailwind CSS**
- 文章来源于 **GitHub Issues**（只读取被 `blog` 标签并处于 open 状态的 issue）
- 支持文章 frontmatter（Gray Matter）或 GitHub Issue Form 格式
- 支持多语言路由：`/zh`、`/en`、`/ja` 等（见 `app/[lang]`）
- 支持数学公式（KaTeX）、代码高亮（highlight.js / rehype）和 Giscus 评论

---

## 📦 快速开始

要求：Node.js (建议 >= 18)，npm

1. 克隆仓库并安装依赖：

```bash
npm install
```

2. 在本地运行：

```bash
npm run dev
# 访问 http://localhost:3000
```

3. 打包与生产运行：

```bash
npm run build
npm start
```

4. 代码风格检查：

```bash
npm run lint
```

---

## 🔧 环境变量

在根目录创建 `.env.local`（或使用部署平台的环境变量），常用变量：

```env
REPO_OWNER=你的 GitHub 用户或组织名
REPO_NAME=包含文章的仓库名（通常是本仓库）
GITHUB_TOKEN=（可选）当读取私有仓库或增加请求配额时使用

# 可选的公开变量（用于 UI 与 Giscus）
NEXT_PUBLIC_REPO_OWNER=可用于显示 GitHub 链接
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=...
NEXT_PUBLIC_GISCUS_CATEGORY=...
NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
```

> 提示：如果仓库公开且不频繁触发 API 限制，可不配置 `GITHUB_TOKEN`；但推荐在生产环境中配置以避免速率限制。

---

## 📝 如何发布文章（通过 GitHub Issues）

该主题将从 Issues 中读取内容，支持三种方式：

1. 使用 **Markdown + YAML frontmatter**（推荐）

```markdown
---
title: "示例文章标题"
slug: "example-post"
lang: "zh"
description: "一句话摘要"
coverImage: "https://.../cover.png"
---

文章内容写在这里，支持 Markdown、代码块、KaTeX 等。
```

2. 使用 **Issue Form**（Repository issue template）—— body 中包含如下 `###` 区段：

```
### Slug
example-post

### Language
zh

### Description
一句话摘要

### Cover Image URL
https://.../cover.png

### Content
（这里写 Markdown 内容）
```

3. 直接在 Issue 正文写 Markdown（回退方案）

注意：Issue 必须打上 `blog` 标签并保持 open 状态。

---

## 目录说明 🔍

- `app/` - Next.js app 路由（含 i18n）
- `components/` - UI / 布局 / Post 组件
- `lib/github.ts` - 从 GitHub Issues 解析与获取文章的逻辑
- `public/styles/` - Giscus 自定义样式等静态资源
- `scripts/vercel-ignore-build.sh` - 部署相关辅助脚本

---

## 部署

推荐使用 **Vercel**：连接仓库、设置环境变量，自动构建即可。也可以用任意支持 Next.js 的平台部署。

---

## 贡献与反馈 ❤️

欢迎提交 issue 或 PR。想要添加功能或修复样式，请先打开 issue 讨论。

---

## 许可证

本项目使用 **MIT** 许可证（见 `LICENSE`）。


