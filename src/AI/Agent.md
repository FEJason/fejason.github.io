# Agent 四层架构模型
Agent 是什么？

Agent 是一个编码代理工具，帮助您使用任意 AI 模型编写和运行代码。它提供终端界面、桌面应用、网页端、云端及 IDE 扩展。

![](../assets/images/AI/Snipaste_2026-07-09_16-57-27.png)

目前主流的 Agent 工具 - 截止 2026-7-9 github Star：

* Hermes 自动进化的 AI 代理。 内置学习闭环的智能代理——从经验中创建技能，在使用中改进技能，主动持久化知识，搜索过往对话，并在跨会话中逐步构建对你的深度理解。

- Hermes            212k  
- OpenCode          184k
- Gemini            106k
- Codex             96.5k
- OpenHands         80.1k
- Cline             64.5k
- ClaudeCode        37.6k
- ...

## CC Switch
什么是 CC Switch？

CC Switch 是一款跨平台桌面应用，专为使用 AI 编程工具的开发者设计。它帮助你统一管理 Claude Code、Codex、Gemini CLI、OpenCode 等应用的配置。

![](../assets/images/AI/Snipaste_2026-07-09_16-14-44.png)

![](../assets/images/AI/Snipaste_2026-07-09_16-21-26.png)

![](../assets/images/AI/Snipaste_2026-07-09_16-22-55.png)

Agent 四层架构模型：
- AGENT.md（记忆系统）​：将项目规范一次性写入配置文件，即可在每次会话中自动加载，不需要反复重申。
- Skills：终结风格飘忽，将代码审查标准配置化、制度化，彻底取代“口头叮嘱”的不确定性。(Superpowers ​：让 Agent 在写代码之前先进行**需求澄清**、设计评审、制定计划，然后逐步执行)
- 子智能体：化解上下文溢出，将涉及多个文件重构任务拆解为多个独立的上下文单元，实现并行处理与逻辑隔离。
- Hooks：在工具调用时自动触发安全检查或日志记录，构建防御性编程机制。
- MCP （Model Context Protocol，模型上下文协议）​：赋予Agent调用外部数据库与API的能力。(蓝湖MCP)
- Headless模式：支持在CI/CD流水线中“无人值守”运行，实现真正的自动化交付。(合并代码到某个分支，自动发布)
- Agent SDK：允许通过代码编排复杂的多步Agent工作流，提升任务执行的灵活性。
- Plugins生态：将上述能力打包封装，便于在团队内部高效分发与复用。

图例：
![](../assets/images/AI/Snipaste_2026-07-07_15-53-50.png)


这四层架构生动地比作一栋摩天大楼。
- 记忆层的记忆系统是深埋地下的地基。若无此根基，其上的一切构建都将无从谈起，随时面临坍塌风险。
- 扩展层的四大组件—Commands、Skills、SubAgents、Hooks，共同构成了建筑的主体楼层，承载着日常运营的核心功能，这是用户最直接感知的价值空间。
- 集成层的集成能力宛如隐藏起来却至关重要的水电管网，它将这座建筑与外部广阔的基础设施网络紧密相连，确保持续的能量与信息流动。
- 编程层的Agent SDK则是位于顶楼的建筑师工作室。在这里，你不再仅仅是住户，而是拥有了设计全新建筑、重构空间逻辑的“至高权力”​。“自下而上审视，是构建视角，关注基石与支撑；自上而下俯瞰，则是使用视角，聚焦功能与体验。


## AGENT.md

AGENT.md 本质上是一份“给AI的员工手册”​，能在每次对话启动时自动加载至AGENT的上下文中。

AGENT 每当开启新对话，它对项目背景、技术栈选择、代码规范及团队约定均一无所知。若未进行任何配置，开发者便需要反复重申诸如“使用TypeScript而非JavaScript”​“优先选用pnpm而非npm”​“测试框架定为Vitest”等基础设定。这种如同新员工入职般重复自我介绍的模式，其低效程度可想而知。

记忆层通过AGENT.md彻底解决了这一痛点。

更为精妙的是，Agent的这种记忆机制构建了一个包含5个层级的记忆体系（见下图）​，每一级均对应不同的适用范围。

![](../assets/images/AI/Snipaste_2026-07-07_16-09-44.png)

这种分级设计背后的工程思想，与CSS的层叠优先级机制，或是软件配置中“全局－用户－项目－本地”的四级覆盖模式如出一辙：每一级均可覆盖上一级的设定，而层级越具体（如本地级）​，其优先级越高。

一个典型的项目级AGENT.md示例如下。

```md
# 项目记忆 AGENT.md

## 技术栈
- 语言：TypeScript 5.x（启用严格模式）
- 框架：Nuxt 4 + Vue 3（组合式 API 风格）
- 状态管理：Pinia（禁用 Vuex）
- 测试：Vitest + Vue Test Utils（所有可导出函数与组件必须包含单元测试）
- 包管理：pnpm（禁用 npm 或 yarn）

## 代码规范
- 组件风格：仅使用 `<script setup>` 函数式组件，禁止 Options API 和 class 组件
- 错误处理：业务逻辑层统一返回 `Result<T, E>` 类型（自定义 Result 工具），严禁在非边界处直接 throw 异常
- 路由与页面：使用 Nuxt 文件系统路由，避免手动注册路由
- 提交规范：遵循 Conventional Commits 格式 — `<type>[optional scope]: <description>`  
  （示例：`feat(auth): add login with QR code`）

## 常用命令
- `pnpm dev` — 启动开发服务器（默认端口 3000）
- `pnpm build` — 构建生产版本
- `pnpm preview` — 预览构建产物
- `pnpm test` — 运行 Vitest 单元测试
- `pnpm lint` — 执行 ESLint + Prettier 代码检查
- `pnpm lint:fix` — 自动修复可修复的 lint 问题
```

基于AGENT.md，AGENT在每次开启对话时便会自动“研读手册”​，从而避免技术栈误用与代码风格漂忽的风险。正如XX所言：​“自从创建了AGENT.md，我再也不必在每次对话中反复强调‘我们使用pnpm，而不使用npm’了。​”


## Skills
Skills是一个基于AGENT.md的技能系统，终结风格飘忽，将代码审查标准配置化、制度化，彻底取代“口头叮嘱”的不确定性。

Skills它不需要用户手动触发，而是由Agent根据当前任务的语义上下文，自动研判并加载相应的技能。  
每个Skill本质上是一个包含SKILL.md的目录。在该文件中，通过YAML Frontmatter（前置元数据）声明skill的名称、描述及允许调用的工具列表。  
Agent正是依据description字段的内容，动态决策“当前任务是否需要激活此Skill”​。  

以下是一个典型的SKILL.md示例：

```YAML
---
# 代码审查
name: code-reviewing
# 审查代码以了解最佳实践和潜在问题。 当用户要求代码审查或提及时使用审查变更。
description: >
  Review code for best practices and potential issues.
  Use when the user asks for code review or mentions
  reviewing changes.
allowed-tools:
  - Read
  - Grep
  - Glob
---


# Code Review Guidelines
你是一名专业的代码审查员……
```


## 子智能体

解决一个更深层次的瓶颈：上下文窗口的有限性

子智能体的策略是：为特定子任务开辟独立的上下文空间——如同在主工作台旁增设一张专用工位，指派专人专注处理局部问题。

这类似于管理者委派任务：无需深究每一行代码或每一步推导，只需接收清晰的结论与可操作的建议，从而在更高层级上高效决策与协调。

你可以为子智能体设置严格的工具权限，例如，规定“代码审查员”仅拥有读取文件的权限，严禁修改任何内容。

## Hooks

Hooks 具备“拦截”能力的模块，和 git hooks 类似。

Skills指导了Agent“怎么做”​，那么Hooks则判断Agent“能不能做”​。

比如：每当Agent试图执行git commit时，自动运行lint检查；如果检查未通过，则直接阻止提交操作。这种“隐形守卫”的角色，使Hooks成为保障代码质量与安全合规的利器。

以下是一个典型的配置示例。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "python .claude/hooks/safety_check.py",
        "blocking": true
      }
    ]
  }
}
```

上述配置的含义是：每当 Agent 准备调用 Bash 工具执行命令时，系统优先运行安全检查脚本；如果脚本返回检查失败​，此次调用将被强制阻断。

无论是Git Hooks、数据库触发器，其本质皆遵循统一模式：在特定事件发生时，自动执行预设逻辑。

## MCP

连接外部世界，它赋予Agent与外部工具及数据源深度交互的本领

以下是一个典型的配置示例。

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Agent 处理流程图

![](../assets/images/AI/Snipaste_2026-07-09_17-25-08.png)


## Agent SDK

摩天大楼的顶楼是建筑师的工作室—在这里，你不再是大楼的住户，而是设计新蓝图的创造者。

对于绝大多数开发者而言，前三层（记忆层、扩展层、集成层）已足以应对日常开发场景。

然而，如果你的愿景是构建团队级AI开发平台，或者设计多Agent协作的自动化系统，那么Agent SDK便是必经之路。
