# Superpowers

Superpowers 是一个为 AI 编程助手（如 Claude Code、OpenCode、Cursor、Copilot CLI 等）设计的完整软件开发方法论框架。它通过一组可组合的 Skill（技能）和引导指令，让 AI Agent 在写代码之前先进行需求澄清、设计评审、制定计划，然后以 TDD 方式逐步执行。

GitHub: https://github.com/obra/superpowers （Stars: 240k，活跃维护中）

## 核心工作流程

Brainstorming → Git Worktree → Writing Plans → Subagent TDD → Code Review → Finish Branch

| 阶段 |	Skill 名称	| 作用 |
| - | - | - |
| 1	| brainstorming |	写代码前通过问答澄清需求，探索方案，分段展示设计并等待确认 |
| 2	| using-git-worktrees	| 设计批准后创建独立分支/工作区，运行项目初始化，验证测试基线 |
| 3	| writing-plans	| 将设计拆分为 2-5 分钟的颗粒度任务，每个任务包含文件路径、完整代码、验证步骤 |
| 4	| subagent-driven-development	| 为每个任务派发新 subagent，执行两阶段审查（规范符合性 → 代码质量） |
| 5	| test-driven-development	| RED-GREEN-REFACTOR 强制执行：先写失败测试→ 验证失败 → 写最小代码 → 通过 → 提交 |
| 6	| requesting-code-review	| 对照计划审查代码，按严重级别报告问题，Critical 问题阻塞进度 |
| 7	| finishing-a-development-branch	| 任务完成后验证测试，提供合并/PR/保留/丢弃选项 |

Agent 在任何任务前都会检查是否有适用的 Skill，这是强制性的，不是建议。

## 安装方式（OpenCode）
### 标准安装

在 opencode.json（全局或项目级）中添加：

```json
{
  "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]
}
```

重启 OpenCode，等待插件安装完成，然后验证：

```
"Tell me about your superpowers"  # 说说你的超能力
```

如果 Windows 上 git 插件安装失败：

```sh
npm install superpowers@git+https://github.com/obra/superpowers.git --prefix "$HOME\.config\opencode"
```

然后在 opencode.json 中指向本地路径：

```json
{
  "plugin": ["~/.config/opencode/node_modules/superpowers"]
}
```

### 使用方式

安装后，Superpowers 的 Skill 会自动触发，不需要手动干预。但你可以随时显式调用：

```text
use skill tool to list skills          # 使用技能工具列出技能
use skill tool to load brainstorming   # 使用技能工具进行头脑风暴
```

### Tool 映射（OpenCode）

Skill 中描述的操作会映射到 OpenCode 的原生工具：

| Skill 描述 | OpenCode 工具 |
| - | - |
| "Create a todo" |	todowrite |
| "Dispatch a subagent" | task 工具 |
| "Invoke a skill" | skill 工具 |
| "Read a file" | read |
| "Edit a file" | apply_patch / edit |
| "Run a shell command" | bash |
| "Search files" | grep, glob |
| "Fetch a URL" | webfetch |

### 包含哪些 Skill

测试：
- test-driven-development — RED-GREEN-REFACTOR 循环

调试：
- systematic-debugging — 4 阶段根因分析
- verification-before-completion — 确保修复有效

协作：
- brainstorming — 苏格拉底式设计精炼
- writing-plans — 详细实现计划
- executing-plans — 批量执行+检查点
- dispatching-parallel-agents — 并发 subagent
- requesting-code-review / receiving-code-review — 代码审查
- using-git-worktrees — 并行开发分支
- finishing-a-development-branch — 合并/PR 决策
- subagent-driven-development — 两阶段审查快速迭代

元：
- writing-skills — 创建新 Skill 的最佳实践
- using-superpowers — 介绍性引导

### 核心理念
- 测试驱动开发 — 永远先写测试
- 系统性方法 > 临时解决 — 流程优于猜测
- 复杂度缩减 — 简单是首要目标
- 证据 > 断言 — 验证后再宣布成功

### 排错
- 检查日志：opencode run --print-logs "hello" 2>&1 | grep -i superpowers
- 确认 opencode.json 配置正确
- 使用 skill 工具列出已发现的 Skill 列表
- 确保 OpenCode 版本支持 experimental.chat.messages.transform hook

社区支持：Discord（https://discord.gg/35wsABTejz）