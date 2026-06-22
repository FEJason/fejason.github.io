# ClaudeCode

Claude Code 是一个代理编码工具，可以读取你的代码库、编辑文件、运行命令，并与你的开发工具集成。可在终端、IDE、桌面应用和浏览器中使用。

## 安装
支持多种安装方式，这里举例

1. 终端

```sh
irm https://claude.ai/install.ps1 | iex
```

安装成功既可以在任何项目中使用，在终端输入 claude 回车即可打开 claude 终端

2. VSCode

## CC Switch


## Skill（技能）

### ui-ux-pro-max-skill

一项人工智能技能，可为跨多个平台和框架构建专业 UI/UX 提供设计智能。

**特征**

- 67 种 UI 风格——玻璃化、黏土化、极简主义、粗犷主义、拟物化、Bento 网格、暗黑模式、AI 原生 UI 等等
- 161 种颜色方案- 与 161 种产品类型一一对应的行业特定颜色方案
- 57 种字体搭配- 精选的字体组合，并导入了 Google Fonts 字体
- 25 种图表类型- 仪表盘和分析的建议
- 15 种技术栈- React、Next.js、Astro、Vue、Nuxt.js、Nuxt UI、Svelte、SwiftUI、React Native、Flutter、HTML+Tailwind、shadcn/ui、Jetpack Compose、Angular、Laravel
- 99 条用户体验指南——最佳实践、反模式和无障碍规则
- 161 条推理规则- 行业特定设计系统生成（v2.0 新增）

**安装**

**使用 Claude Marketplace（Claude Code）**

使用两条命令即可在 Claude Code 中直接安装：

在 Claude Code 中运行以下命令，提示：/插件在此环境中不可用。（估计 apiKey 的方式不支持）

```bash
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**使用命令行界面（推荐）**

```bash
# 全局安装 CLI
npm install -g uipro-cli

# 为您的AI助手安装
uipro init --ai claude      # Claude Code
uipro init --ai cursor      # Cursor
uipro init --ai windsurf    # Windsurf
uipro init --ai antigravity # Antigravity
uipro init --ai copilot     # GitHub Copilot
uipro init --ai kiro        # Kiro
uipro init --ai codex       # Codex CLI
uipro init --ai qoder       # Qoder
uipro init --ai roocode     # Roo Code
uipro init --ai gemini      # Gemini CLI
uipro init --ai trae        # Trae
uipro init --ai opencode    # OpenCode
uipro init --ai continue    # Continue
uipro init --ai codebuddy   # CodeBuddy
uipro init --ai droid       # Droid (Factory)
uipro init --ai kilocode    # KiloCode
uipro init --ai warp        # Warp
uipro init --ai augment     # Augment
uipro init --ai all         # All assistants
```

安装成功：C:\Users\admin\.claude\skills

**先决条件**

搜索脚本需要 Python 3.x 版本。

```bash
# Check if Python is installed
python --version

# macOS
brew install python3

# Ubuntu/Debian
sudo apt update && sudo apt install python3

# Windows
winget install Python.Python.3.12
```

**用法**

**技能模式（自动激活）**

**支持：** Claude Code、Cursor、Windsurf、Antigravity、Codex CLI、Continue、Gemini CLI、OpenCode、Qoder、CodeBuddy、Droid (Factory)、KiloCode、Warp、Augment

当您请求 UI/UX 设计工作时，该技能会自动激活。只需自然地聊天即可：

```text
为我的SaaS产品构建一个登录页面
```

**示例提示**

```text
为我的SaaS产品构建一个登录页面

创建医疗保健分析仪表板

设计一个暗黑模式的作品集网站

为电子商务制作移动应用UI

打造一款深色主题的数字货币应用
```

**工作原理**

- 您提出任何 UI/UX 任务（构建、设计、创建、实现、审查、修复、改进）
- 设计系统已生成- AI 使用推理引擎自动生成完整的设计系统
- 智能推荐——根据您的产品类型和要求，找到最匹配的样式、颜色和字体。
- 代码生成- 使用正确的颜色、字体、间距和最佳实践来实现用户界面
- 交付前检查- 验证是否存在常见的 UI/UX 反模式

**支持的技术栈**

该技能提供了针对特定技术栈的指导原则，具体包括：

| Category | Stacks |
|----------|--------|
| **Web (HTML)** | HTML + Tailwind (default) |
| **React Ecosystem** | React, Next.js, shadcn/ui |
| **Vue Ecosystem** | Vue, Nuxt.js, Nuxt UI |
| **Angular** | Angular |
| **PHP** | Laravel (Blade, Livewire, Inertia.js) |
| **Other Web** | Svelte, Astro |
| **iOS** | SwiftUI |
| **Android** | Jetpack Compose |
| **Cross-Platform** | React Native, Flutter |

只需在提示中提到您喜欢的技术栈，或者让它默认为HTML+Tailwind。

**此时可能会有问题？这个 Skill 是否在没有UI图时，才有价值？**

**没有UI图时，它的价值（最大化）**

当你只有：

```text
“我要做一个 SaaS 登录页”
```

没有设计稿时，它会：

* 自动选择风格（如 Minimal / SaaS / Trust-focused）
* 自动生成 layout
* 自动生成 color system
* 自动生成 typography
* 自动生成 UX flow

本质：**从 0 到 1 做设计决策**

---

**有 UI 设计图时，还需要它吗？**

结论：需要，但作用变了

变成：

> “UI设计图 → 工程化实现增强器 + 设计校验器”

---

**有 UI 图时，它的 4 个真实价值**

设计稿通常缺：

* 响应式细节
* hover / active 状态
* loading / empty state
* 动效
* 可访问性（a11y）

这个 Skill 会补：

```text
✔ hover 状态
✔ transition 150–300ms
✔ focus ring
✔ mobile breakpoint
✔ skeleton loading
```

---