# OpenCode
## 什么是 OpenCode？
OpenCode 是一个开源代理，帮助您使用任意 AI 模型编写和运行代码。它提供终端界面、桌面应用、网页端、云端及 IDE 扩展。

- 支持 LSP：为 LLM（大语言模型） 自动加载合适的 LSP （语言服务器协议：代码补全、跳转定义、查找引用、重命名、悬浮提示...）
   举例：你在 VS Code 中编写 JavaScript，背后其实是 typescript-language-server（即使你写的是 .js 文件）
   或 Volar（在 Vue 项目中）这类 LSP 服务器在提供智能功能，例如代码补全、跳转到定义、类型提示和错误检查。
- 多会话：在同一个项目中并行启动多个代理
- 分享链接：分享任意会话链接以供参考或调试
- 任意模型：通过 Models.dev 支持 75+ LLM 提供商，包括本地模型
- 任意编辑器：提供终端界面、桌面应用及 IDE 等扩展

## 和 Claude Code 有什么不同？

功能上很相似，关键差异：

- 100% 开源，几乎具备了 Claude Code 的一切功能。
- 不绑定特定提供商。可搭配 Claude、GitHub、OpenAI、Google、deepSeek、Alibaba、Xiaomi 甚至本地模型。
- 内置 LSP 支持。
- 聚焦终端界面 (TUI)。OpenCode 由 Neovim 爱好者和 terminal.shop 的创建者打造，会持续探索终端的极限。
- 客户端/服务器架构。可在本机运行，同时用移动设备远程驱动。TUI 只是众多潜在客户端之一。

## 安装
支持多种安装方式，这里举例

1. 使用 Node.js 安装

```sh
npm install -g opencode-ai
```
安装好后，在终端输入 opencode 启动 OpenCode，进入 TUI（文本用户界面）

2. 使用 Vscode 插件
- 插件市场搜索 opencode 安装
- 安装完成后，点击右上角图标打开，或者 Ctrl+Shift+P 输入 Open opencode 启动。

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

- Big Pickle            // 轻量通用模型，日常 Agent / CLI
- MiniMax M2.5 Free     // 强 Agent 编码模型，写代码、改项目
- Nemotron 3 Super Free // NVIDIA 大模型，大型代码分析
- Ring 2.6 1T Free      // 超大参数 MoE 模型，复杂 Agent 工作流
- DeepSeek V4 Flash     // 国内模型

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

在 TUI 中运行 /connect (连接) 命令，选择任一提供商，比如 opencode，然后前往 opencode.ai/auth。

```sh
/connect
```

登录并添加账单信息，然后复制你的 API 密钥。

粘贴你的 API 密钥。

## OpenCode 有两种模式
- Build 模式：用于开发、测试、调试、部署（会修改文件）。
- Plan 模式：用于项目规划、需求分析、设计（不会修改文件）。

使用 Tab 键切换模式

## 使用

### 全局配置
我希望 opencode 始终使用中文回复，如何配置？

可以。通过 opencode 的 全局规则实现：

1. 创建/编辑全局 AGENTS.md 文件：
   - Windows: C:\Users\<你的用户名>\.config\opencode\AGENTS.md
   - Linux/macOS: ~/.config/opencode/AGENTS.md

2. 写入以下内容：

```md
## 语言要求

- 思考过程用中文
- 回答用中文
- 所有输出用中文回复
```

这样所有项目都会用中文回复。如果想针对单个项目，在项目根目录放同名的 AGENTS.md 即可（项目级优先级高于全局）。

### 初始化
运行以下命令为项目初始化 OpenCode

```
/init
```

什么时候执行？
- 在项目基本结构创建完成后、执行。
- 当项目结构发生重大变化时（如新增模块、大幅改动目录结构等），可能需要重新运行 /init 来更新 AGENTS.md，让 AI 更好地理解当前的项目状态

OpenCode 会分析你的项目并在项目根目录创建一个 AGENTS.md 文件。

提示：你应该将项目的 AGENTS.md 文件提交到 Git。这有助于 OpenCode 理解项目结构和编码规范。

### 提问
你可以让 OpenCode 为你讲解代码库。

提示：使用 @ 键可以模糊搜索项目中的文件。

当你遇到不熟悉的代码时，这个功能非常有用。

### 添加功能

你可以让 OpenCode 为项目添加新功能。不过我们建议先让它制定一个计划。

#### 制定计划

OpenCode 有一个计划模式 (Plan)，该模式下它不会进行任何修改，而是建议如何实现该功能。

使用 Tab 键切换到计划模式。你会在右下角看到模式指示器。

接下来描述你希望它做什么

你需要提供足够的细节，让 OpenCode 理解你的需求。可以把它当作团队中的一名初级开发者来沟通。

```text
- 移除 UserAvatar 组件中的修改头像逻辑（上传、调用接口）。 
- 在商户信息编辑页面，当用户点击提交时，将头像的 avatarId 和 avatarUrl 传递给更新商户接口
```

提示：为 OpenCode 提供充足的上下文和示例，帮助它理解你的需求。

#### 迭代计划
当它给出计划后，你可以提供反馈或补充更多细节。

```text
移除 UserAvatar 组件中的修改头像逻辑（上传、调用接口），不要移除裁剪逻辑，裁剪完页面显示该头像但不用调之前的修改头像接口
```

#### 构建功能
当你对计划满意后，再次按 Tab 键切换回构建模式 (Build)。


### 直接修改

对于比较简单的修改，你可以直接让 OpenCode 实施，无需先审查计划。

```
在 /types 里面新增一个类型定义文件，将当前组件的 props 定义移动到 types 文件夹下
```

请确保提供足够的细节，以便 OpenCode 做出正确的修改。

### 撤销修改

假设你让 OpenCode 做了一些修改。

```text
重构@/src/api/index.ts中的函数
```

但你发现结果不是你想要的。你可以使用 /undo (撤销) 命令来撤销修改。

```text
/undo
```

OpenCode 会还原所做的修改，并重新显示你之前的消息。

```text
重构@/src/api/index.ts中的函数
```

你可以调整提示词，让 OpenCode 重新尝试。

你可以多次运行 /undo 来撤销多次修改。

你也可以使用 /redo 命令来重做修改。

```text
/redo
```

### 分享

你与 OpenCode 的对话可以与团队分享。

```sh
/share
```

这会生成当前对话的链接并复制到剪贴板。


以上就是基本内容！你现在已经是 OpenCode 的使用高手了。


## Wbe 开发实例

1. 切换到 Plan 计划模式，用自然语言向 OpenCode 描述你的项目需求

```
# 搭建一个 vite + vue + typescript 的新项目
- 项目为移动端项目，需要使用rem，使用插件将UI图的px 自动转换为rem
- 使用 vue-i18n 实现国际化
- 使用 tailwindcss 实现样式开发，同时支持 sass
- 使用 vue router 使用独立文件定义路由表文件、全局守卫文件，配置 layout 默认模版（包含公共头部、公共底部）
- 支持 keepalive
- 使用 pinia，支持持久化配置，状态管理文件分模块
- 使用 axios 封装请求、响应拦截器
- 统一管理所有的 api 请求
- 使用 vue3 setup 组合式函数开发
- vite 配置 vant UI 自动导入
- vite 配置常用钩子自动导入，在使用的时候不需要 import
- vite 配置接口请求代理
- 配置环境变量文件：development、sit、uat、production
- 配置项目最常用的 eslint 规则，配置 Prettier，一行不超过100字符...，配置vscode保存自动格式化
- package.json 配置 volta node 版本，确保团队成员使用统一的 node 版本
- package.json 配置 启动、打包命令：npm run dev、npm run sit、npm run build、npm run build:sit、npm run build:uat
```

```
# 搭建一个 nuxt4 + typescript 的新项目
- 项目为PC端，支持响应式移动端显示
- 使用 Element Plus + Vant UI组件，vite 配置 UI 自动导入，默认使用暗黑模式，修改 Element Plus 的样式变量
- 使用 @nuxtjs/i18n 实现国际化
- 定义国际化配置文件，en_US.json、es_ES.json、ko_KP.json、pt_PT.json、ru_RU.json、th_TH.json、tr_TR.json、vi_VN.json、zh-TW.json
- 配置项目最常用的 eslint 规则，配置 Prettier 美化，一行不超过100字符等等常见配置...，配置vscode保存自动格式化
- 配置环境变量文件：development、sit、uat、production
- 使用 tailwindcss 实现样式开发，同时支持 sass
- 配置 layout 默认模版（包含公共头部、公共底部）
- 支持 keepalive
- 使用 @pinia/nuxt，使用 pinia-plugin-unstorage/nuxt 支持持久化配置，状态管理文件分模块
- 使用 axios 封装请求、响应拦截器
- 统一管理所有的 api 请求
- vite 配置自动导入的API：`vue`、`vue-router`、`i18n`
- vite 配置自动导入的目录，比如：/utils /components 在使用的时候不需要 import
- vite 配置接口请求代理
- package.json 配置 volta "node": "20.19.5"，确保团队成员使用统一的 node 版本
- package.json 配置 启动、打包命令：npm run dev、npm run sit、npm run build、npm run build:sit、npm run build:uat
- 支持服务端渲染部署、静态站点生成 (SSG)、静态单页应用 (SPA) 
```

这里AI会和你探讨项目计划，提出建议，需要你确认

确认后，切换到 Build 构建模式，开始构建项目

这里一次交代太多任务，会导致某些任务达不到预期，其实还是因为沟通细节不够。可以逐条去实施。

后面调整方案：
- 先用终端命令行手动创建 Nuxt4 项目
- 再使用 Agent 逐条运行，实现功能


2. 初始化

框架搭建完成后，执行初始化

```
/init
```

OpenCode 会分析你的项目并在项目根目录创建一个 AGENTS.md 文件。

提示：你应该将项目的 AGENTS.md 文件提交到 Git。这有助于 OpenCode 理解项目结构和编码规范。


3. 当 OpenCode 显示上下文使用率接近上限（如 >90%）时，说明你当前提交给模型的代码/文件太多，
可能导致关键信息被截断、响应质量下降。

这时需要主动 清理或压缩上下文，以下是高效实用的方法：

- 关闭无关文件
- 使用“@”指令精准引用文件
- 新建会话 /new
- 查看历史会话 /session，删除会话


## 关于 AI 焦虑

现在掘金、知乎，甚至一些公众号，总能看到类似的标题：“XXX 筛掉了 90%的人”、“AI生成代码命中率90%，开发要失业了”，“xx解散前端部门了，xxx”“不会用AI的前端，必被淘汰”。伴随着各种疯狂发展的AI工具，各类低代码平台、一键生成页面的插件，很多人开始害怕AI，甚至有人开始怀疑自己多年的技术积累是不是变得毫无价值。

难道前端这么不堪？一夜之间，前端开发就变成了“谁都能上手、谁都能替代”的工种？

## 别被 AI 焦虑绑架了

**焦虑的从来不是 AI，而是行业进入“存量竞争”后的淘汰压力。**  

AI 只是催化剂，甚至成了企业裁员的“正当理由”。真正被替代的，从来不是“前端”这个岗位，而是**只做重复、低价值工作的开发者**。

---

### AI 会替代什么？不会替代什么？

**容易被替代的**：  
- 纯 CRUD（增删改查）
- 机械还原设计稿、不考虑体验的 UI 交互 

这些工作高度重复，AI 拿到需求和接口，就能生成可用代码。

**难被替代的，才是你的核心价值**：  
1. **工程化能力**：Vite/Webpack 优化、CI/CD、包体积分析——需要深入理解工具链和系统原理。  
2. **架构设计**：微前端、权限体系、状态管理——要全局视角和业务理解。  
3. **复杂交互**：可视化、富文本编辑器、实时协作——依赖经验与用户思维。  
4. **问题排查**：线上 Bug、浏览器兼容性——千变万化，无标准答案。

AI 擅长“生成片段”，但**无法设计系统、把控全局、解决真实世界的混沌问题**。

---

### 普通开发者的应对策略

#### 别被“AI 焦虑课”割韭菜  
“3 天学会 AI 编程”“月薪翻倍”？大多是教你怎么点按钮。  
学完你只是个“会用 AI 的工具人”，**核心竞争力没变**。

#### 理性看待 AI：它是工具，不是救世主  
就像当年的 jQuery、Vue，AI 是**提效手段**：  
- 用它写重复代码  
- 用它查资料、跑 Demo  
- 把省下的时间，投入更有价值的事  

**别把前途寄托在工具上。**

#### 聚焦核心能力提升  
前端早已不是“写页面”：  
- **工程化**：构建、部署、性能优化  
- **架构力**：模块拆分、微前端、状态治理  
- **特色方向**：小程序、桌面应用、3D/GIS、VSCode 插件……  
**深耕一两个领域，形成技术壁垒。**

#### 学会“驾驭 AI”，而不是对抗它  
拒绝 AI，只会被时代甩下。  
正确姿势：  
> **AI 写代码，你设计系统；  
> AI 给片段，你把控全局；  
> AI 解简单问题，你攻复杂难题。**

---

### 最后说一句

> **AI 不是来抢你工作的，是来放大差距的。**

它会让**有核心能力的人更强大**，也会让**只做低价值工作的人更快出局**。

与其焦虑，不如沉下心：  
**守住不可替代性，把 AI 变成你的杠杆。**

前端不会消失，但“只会切图”的前端，确实危险了。  

--- 
