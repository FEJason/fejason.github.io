# Vue 3 + Vite 项目中本地图片使用指南

> 适用于单页应用（SPA）与多页应用（MPA）  
> 基于 **Vue 3 + Vite** 构建体系  
> 涵盖 `src/assets`、`shared/assets`、动态导入、`public` 目录及 `new URL` 等核心场景

---

## 一、项目结构约定

```bash
project-root/
├── public/                 # 静态资源目录（不参与构建）
│   └── favicon.ico
├── src/                    # 主应用入口（SPA）
│   ├── assets/
│   │   └── images/
│   └── main.js
├── shared/                 # 共享资源目录（用于 MPA 或微前端）
│   └── assets/
│       └── images/
└── vite.config.js
```

---

## 二、`/src/assets/` —— 单页应用（SPA）中的本地图片

### 1. 静态引用（推荐）

```vue
<template>
  <img :src="logo" alt="Logo" />
</template>

<script setup>
import logo from '@/assets/images/logo.png'
</script>
```

```vue
<template>
  <img src="@/assets/images/logo.png" alt="Logo" />
</template>
```

**优点**：
- 路径由 Vite 处理，支持别名（如 `@/`）
- 图片参与构建：压缩、哈希命名、Base64 内联（小图）
- 支持类型提示和 Tree-shaking

---

### 2. 在 `<style>` 中直接使用 `url('@/assets/...')`

**完全支持！**

```vue
<template>
  <div class="hero-bg"></div>
</template>

<style scoped>
.hero-bg {
  background: url('@/assets/images/hero.webp') no-repeat;
  background-size: cover;
}
</style>
```

> **说明**：Vite 会自动解析 CSS 中的 `@/` 别名（需在 `vite.config.js` 中配置 `resolve.alias`），并正确处理资源依赖。

---

### 3. 在 Tailwind CSS 类中使用任意背景图

**同样支持！**

```vue
<template>
  <div class="bg-[url('@/assets/images/bg.png')] bg-no-repeat bg-cover w-full h-64"></div>
</template>
```

> **说明**：Tailwind 的任意值（arbitrary value）语法 `bg-[url(...)]` 会被原样插入 CSS。只要你的构建工具（Vite）能解析 `@/`，该写法就有效。

> ⚠️ 前提：已在 `vite.config.js` 中配置 `@` 别名。

---

## 三、`/shared/assets/` —— 多页应用（MPA）或共享资源

### 1. 配置 Vite 别名（`vite.config.js`）

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, 'shared')
    }
  }
})
```

### 2. 使用共享图片

#### 方式 A：JS 中 import
```js
import icon from '@shared/assets/images/icon.svg'
```

#### 方式 B：CSS/Tailwind 中直接引用
```css
/* 在 <style> 中 */
.banner {
  background: url('@shared/assets/images/banner.jpg');
}
```

```html
<!-- 在 Tailwind 类中 -->
<div class="bg-[url('@shared/assets/images/pattern.png')]"></div>
```

**适用场景**：
- 多入口（MPA）项目复用素材
- 微前端架构下主应用与子应用共享资源
- 组件库与业务代码共用图标/插图

---

## 四、动态导入本地图片

### 1. 使用 `import.meta.glob`（推荐）

```js
const imageMap = import.meta.glob('@/assets/images/badges/*.png', { eager: true })

export function getBadgeImage(name) {
  return imageMap[`./${name}.png`]?.default
}
```

> 安全、可预测、支持构建优化

---

### 2. 运行时动态 `import()`（谨慎使用）

```js
async function loadImg(name) {
  return (await import(`@/assets/images/${name}.webp`)).default
}
```

> ⚠️ Vite 会将匹配目录所有文件打包，避免路径注入风险。

---

## 五、`new URL(..., import.meta.url)` —— 显式资源引用（推荐用于 MPA/共享资源）

Vite 推荐使用 [`new URL`](https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url) 语法显式声明静态资源依赖，尤其适合：

- 多页应用（MPA）
- 共享资源（`shared/`）
- 需要明确控制资源路径的场景

### 示例：在 JS/TS 中获取图片 URL

```js
// 获取 src/assets 下的图片
const logoUrl = new URL('@/assets/images/logo.png', import.meta.url).href

// 获取 shared/assets 下的图片
const sharedBgUrl = new URL('@shared/assets/images/bg.jpg', import.meta.url).href
```

### 在 Vue 组件中使用：

```vue
<template>
  <img :src="logoUrl" />
  <div 
    class="bg-no-repeat bg-cover"
    :style="{ backgroundImage: `url(${bgUrl})` }"
  />
</template>

<script setup>
const logoUrl = new URL('@/assets/images/logo.png', import.meta.url).href
const bgUrl = new URL('@shared/assets/images/bg.webp', import.meta.url).href
</script>
```

### 优势：
- **语义清晰**：明确表示“这是一个静态资源”
- **路径可靠**：不受当前模块路径影响
- **兼容性强**：未来标准，Vite 官方推荐
- **支持别名**：配合 `resolve.alias` 可正常使用 `@/`、`@shared/`

> 特别适合在 **非 SFC 文件**（如 utils、store、router）中引用图片。

---

## 六、`public/` 目录的使用规范

### 特性总结：

| 特性 | 说明 |
|------|------|
| ❌ 不参与 Vite 构建 | 无压缩、无哈希、无 Base64 优化 |
| ❌ 无法 `import` 或 `new URL` 引用 | 只能通过绝对路径访问 |
| ✅ 直接通过 `/xxx` 访问 | 如 `/images/logo.png` → `public/images/logo.png` |
| ✅ 适合外部直接访问 | 如 SEO 图、微信分享图、robots.txt |

### 使用方式：

```html
<img src="/images/external-banner.jpg" />
```

```js
const imgUrl = `/images/icons/${type}.png` // 仅限 public 下资源
```

### 何时使用 `public/`？
- 被第三方（微信、搜索引擎）直接抓取的图片
- 超大媒体文件（>10MB）不想进 bundle
- 已部署到 CDN 的资源临时本地调试

> 🚫 **不要**把常规 UI 图片放 `public/`，会失去构建优化！

---

### 最佳实践总结：

| 场景 | 推荐方式 |
|------|--------|
| 组件内静态图 | `import img from '@/assets/...'` |
| CSS/Tailwind 背景 | `url('@/assets/...')` 或 `bg-[url('@/assets/...')]` |
| 共享资源（MPA） | 配置 `@shared` + `new URL('@shared/...', import.meta.url)` |
| 动态但有限集合 | `import.meta.glob` |
| 外部可访问资源 | 放 `public/`，用 `/xxx` 引用 |

> **终极建议**：  
> - **优先使用 `import` 或 `new URL`** 获取本地图片  
> - **放心在 CSS/Tailwind 中使用 `@/` 路径**（确保别名已配）  
> - **`public/` 仅用于真正“静态”的外部资源**

### 礼物小程序 Lottie 动画组件注意事项

```bash
project-root/
├── public/                 # 静态资源目录（不参与构建）
│   └── favicon.ico
├── shared/                 # 共享资源目录（用于 MPA 或微前端）
│   └── assets/
│       └── images/
│       └── lottie/
│         └── gift-box/     # 礼物小程序 Lottie 动画
│           └── images/     
│           └── data.json   # 动画数据里面的图片路径默认是 images/
└── vite.config.js
```

- 多页应用，共享动画组件
- 需要将 Lottie images/ 移动到 public/ 中
- data.json 中 images 路径默认是 images/，替换为 /lottie/gift-box/images/

```bash
project-root/
├── public/                 # 静态资源目录（不参与构建）
│   └── favicon.ico
│   └── lottie/
│     └── gift-box/
│       └── images/         # Lottie 动画图片
├── shared/                 # 共享资源目录（用于 MPA 或微前端）
│   └── assets/
│       └── images/
│       └── lottie/
│         └── gift-box/     # 礼物小程序 Lottie 动画
│           └── images/     # 移动到 public/lottie/gift-box/images/
│           └── data.json   # 动画数据里面的图片路径默认是 images/，需要替换为 /lottie/gift-box/images/
└── vite.config.js
```