# OpenCode
## 什么是 OpenCode？
OpenCode 是一个开源代理，帮助您使用任意 AI 模型编写和运行代码。它提供终端界面、桌面应用及 IDE 扩展。

- 支持 LSP：为 LLM 自动加载合适的 LSP
- 多会话：在同一个项目中并行启动多个代理
- 分享链接：分享任意会话链接以供参考或调试
- 任意模型：通过 Models.dev 支持 75+ LLM 提供商，包括本地模型
- 任意编辑器：提供终端界面、桌面应用及 IDE 扩展

## 和 Claude Code 有什么不同？

功能上很相似，关键差异：

- 100% 开源，几乎具备了 Claude Code 的一切功能。
- 不绑定特定提供商。可搭配 Claude、GitHub、OpenAI、Google、deepSeek、Alibaba、Xiaomi 甚至本地模型。
- 内置 LSP 支持。
- 聚焦终端界面 (TUI)。OpenCode 由 Neovim 爱好者和 terminal.shop 的创建者打造，会持续探索终端的极限。
- 客户端/服务器架构。可在本机运行，同时用移动设备远程驱动。TUI 只是众多潜在客户端之一。

## 安装
支持多种安装方式，这里举例使用 Node.js 安装

```sh
npm install -g opencode-ai
```

安装好后，在终端输入 opencode 启动 OpenCode，进入 TUI（文本用户界面）

在输入框中输入斜杠命令：

```sh
/models
```

按下回车后，界面会弹出一个模型选择面板。在这里你可以：

- 浏览列表：查看所有可用的模型。
- 识别免费模型：带有 Free 标记的模型（如 MiniMax M2.5, Nemotron 3 Super）无需 API Key 即可直接使用。
- 切换模型：使用方向键选择并按回车，即可在当前会话中切换到该模型。

## 免费模型
OpenCode 自带一组免费模型，无需创建账户即可使用，可以随便造随便玩。

- Big Pickle
- MiniMax M2.5
- Nemotron 3 Super

使用插件还能免费接入 Gemini 3Pro、Claude 4.5 Opus 等顶级编程模型（亲测发送消息没有返回，一直Loading）

使用插件 opencode-antigravity-auth

Antigravity 是谷歌推出的一个AI编程IDE，它里面十分慷慨地提供了免费gemini-3.1-pro、claude-opus-4-6-thinking 这两个顶级的 AI 编程模型，我们可以借助这个插件把这两个模型免费的接入 opencode 里面使用。

1. 打开 github 地址 https://github.com/NoeFabris/opencode-antigravity-auth
2. 选择第一种方式，让大模型自动下载插件，复制内容
3. 打开 Vscode，安装 opencode 插件
4. 在 Vscode 中 Ctrl+Shift+P 打开命令面板输入：Open opencode，这样就以插件的形式打开了 opencode
5. 粘贴刚才在 github 上复制的内容，自动安装 opencode-antigravity-auth
6. 插件安装完成，复制 opencode auth login 命令，打开一个新终端粘贴回车，模型供应商选择 Google -> Antigravity -> Prject ID 直接回车会跳转浏览器登录谷歌账号 -> 然后把浏览器地址栏生成的 URL 粘贴到命令行回车，选择n回车，这样就登录成功了。
7. 重启 opencode，输入 /models ，模型选择里面就可以选择 Antigravity 相关的模型了。

遇到问题？
- 这个插件已做风险提示：有封谷歌账号的风险
- 发送消息没有返回（一直转圈或无响应），通常是因为“路不通”（网络被阻断）或者“配额没了”（账号被限流）

## 配置 API 密钥
通过 OpenCode，你可以配置 API 密钥来使用任意 LLM 提供商（大语言模型的服务提供方）。

在 TUI 中运行 /connect 命令，选择任一提供商，比如 opencode，然后前往 opencode.ai/auth。

```sh
/connect
```

登录并添加账单信息，然后复制你的 API 密钥。

粘贴你的 API 密钥。

## 开启第一个应用

使用 OpenCode 开发一个新的 Web 项目，可以遵循一个从规划到部署的清晰流程。OpenCode 的核心优势在于它能通过自然语言对话，帮你完成从项目初始化、前后端开发到测试部署的多个环节。

以下是使用 OpenCode 从零开始开发一个 Web 项目的完整流程：

### 第一步：项目初始化与规划

这是项目的起点，你需要告诉 OpenCode 你的想法，让它帮你搭建骨架。

1.  **创建项目目录**：
    在你的电脑上创建一个空文件夹，并在终端中进入该目录。
    ```bash
    mkdir my-new-web-app
    cd my-new-web-app
    ```

2.  **启动 OpenCode 并初始化**：
    在终端中输入 `opencode` 启动。首次进入时，可以输入 `/init` 命令。这会让 OpenCode 扫描当前目录（虽然是空的），并创建必要的配置文件（如 `.opencode/` 和 `AGENTS.md`），为后续开发做好准备。

3.  **进行项目规划**：
    这是最关键的一步。你可以用自然语言向 OpenCode 描述你的项目需求。OpenCode 的 `plan` 模式会像一个技术负责人一样，帮你设计项目结构和开发路线。
    *   **你可以这样提问**：
        > “我想创建一个个人博客网站。前端用 React，后端用 Node.js 和 Express。请帮我规划项目结构，并生成前后端的初始代码。”

    OpenCode 会分析你的需求，然后生成包括数据库设计、API 接口规划、业务逻辑等在内的完整方案。

### 第二步：前后端开发与联调

规划完成后，OpenCode 会根据你的指令开始编写代码。

1.  **后端开发**：
    你可以继续与 OpenCode 对话，让它实现具体的后端功能。
    *   **示例指令**：
        > “帮我创建用户注册和登录的 API 接口。”
        > “为博客文章添加一个发布和获取列表的功能。”
    OpenCode 会自动创建或修改相应的文件（如 `server.js`, `routes.js` 等），并写入完整的代码逻辑。

2.  **前端开发**：
    同样，你可以让 OpenCode 生成前端页面。
    *   **示例指令**：
        > “创建一个登录页面，包含用户名和密码输入框。”
        > “生成一个展示博客文章列表的首页。”
    它会生成对应的 HTML、CSS 和 JavaScript/React 组件代码。

3.  **前后端联调**：
    你可以要求 OpenCode 帮助你连接前后端。
    *   **示例指令**：
        > “修改前端登录页面，让它调用后端的 `/api/login` 接口。”
    OpenCode 会理解你的意图，并修改前端代码，配置正确的 API 地址，完成数据交互的对接。

### 第三步：测试与调试

在开发过程中，难免会遇到 Bug，OpenCode 可以作为你的调试助手。

1.  **交互式调试**：
    当你的代码运行出错时，可以将错误信息告诉 OpenCode，或者让它直接分析代码文件。
    *   **示例指令**：
        > “运行 `npm start` 后报错了，错误信息是...，请帮我分析原因并修复。”
    OpenCode 的 `build` 模式可以自动识别常见错误，提供修复建议，甚至直接应用修复。

2.  **代码质量检查**：
    你可以随时让它检查代码质量或进行重构。
    *   **示例指令**：
        > “检查一下 `src/App.js` 文件，看有没有可以优化的地方。”

### 第四步：一键部署

当项目开发完成后，OpenCode 可以帮助你快速将其部署到线上。

1.  **推送到代码仓库**：
    首先，你需要将本地代码推送到 GitHub 等代码托管平台。

2.  **连接部署平台**：
    然后，你可以使用 Vercel 这类支持一键部署的平台。
    *   打开 Vercel 官网，连接你的 GitHub 账号。
    *   导入你刚刚推送的项目仓库。
    *   点击「Deploy」按钮。

    大约几十秒后，你的网站就会获得一个真实的线上访问地址。

### 流程总结

整个过程可以概括为：

**创建项目 → 启动 OpenCode → 自然语言描述需求 → AI 规划并生成代码 → 持续对话迭代功能 → 调试优化 → 部署上线**

这个流程将传统开发中需要产品经理、前端工程师、后端工程师和测试工程师协同工作数周的任务，浓缩为一个人借助 AI 在几天内就能完成的快速迭代过程，极大地提升了开发效率。

## Wbe 开发实例
1. /init

2. 用自然语言向 OpenCode 描述你的项目需求

```
# 搭建一个 vite + vue + typescript 的新项目 
- 项目只有移动端样式，所以需要使用rem，使用插件将UI图的px 自动转换为rem  
- 使用i18n实现国际化                                             
- 使用 twcss 实现样式开发                                       
- 使用 vue router 定义路由表文件、全局守卫文件（使用独立文件）                         
- 支持 keepalive
- 使用 pin 实现全局状态管理，状态管理文件分模块                          
- 使用 axios 封装请求、响应拦截                                  
- 统一管理所有的 api 请求                                       
- 使用 typescript                                              
- vite 配置 vant UI 自动导入                                  
- vite 配置常用钩子自动导入，在使用的时候不需要 import 
- vite 配置接口请求代理                               
- 配置4个环境变量文件、dev、sit、uat、pro          
- 定义项目最常用的 eslint 规则，定义语法格式美化规则，一行不超过100字符，vscode保存自动格式化
- package.json 配置 valot node 版本，确保团队成员使用统一的 node 版本
- package.json 配置 启动、打包命令：npm run dev、npm run sit、npm run build、npm run build:sit、npm run build:uat
```