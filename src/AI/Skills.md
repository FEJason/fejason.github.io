# Skills 使用分享文档

## 1. 什么是 Skills

Skills，可以理解为 AI Agent 的专业能力插件。

它解决的核心问题是：**让 AI 助手拥有特定领域的专业知识和最佳实践**，而不是靠通用模型"猜"着做。

一句话概括：

**Skills 不是让 AI 更通用，而是让 AI 在特定领域更专业。**

## 2. Skills 的核心组成

Skills 本质上是一套结构化的知识包，包含三部分：

- **知识数据**：该领域的最佳实践、规则、示例，以 CSV / JSON 等结构化格式存储
- **工作流指令**：告诉 AI 在接到该领域任务时应该按什么步骤执行
- **辅助脚本**：可选的搜索、验证、生成脚本，增强 AI 的执行能力

常见的 Skills 能力维度：

- `产品设计`：UI 风格体系、配色方案、字体搭配、UX 准则
- `开发框架`：React / Vue / Nuxt / Flutter 等框架的最佳实践
- `测试验证`：测试策略、用例模板、边界条件检查清单
- `部署运维`：CI/CD 配置、容器化、监控告警配置规范
- `代码审查`：代码规范检查清单、性能优化建议、安全审计规则

## 3. 常见的 Skills 有哪些

Skills 可以从几个来源获取：

### 3.1 官方 Skills 市场

Skills 生态目前有大量社区贡献的技能包，可以通过 Skills CLI 搜索和安装：

```bash
npx skills find <关键词>
```

热门 Skill 示例：

- **UI/UX Design Skills**：涵盖 67 种样式、96 个配色方案、57 种字体搭配、99 条 UX 准则，覆盖 13 个技术栈
- **React / Next.js Skills**：React 和 Next.js 的开发规范和最佳实践
- **Vue / Nuxt Skills**：Vue 和 Nuxt 的组件开发指南
- **Flutter Skills**：移动端 Flutter 开发的设计和代码规范
- **前端测试 Skills**：单元测试、组件测试、E2E 测试的策略模板

### 3.2 自定义 Skills

团队也可以根据自身业务封装私有 Skills，例如：

- 公司组件库使用规范
- 内部 API 设计规范
- 项目目录结构和命名约定
- 发布流程和检查清单

## 4. Skills 如何安装和使用

### 4.1 安装 Skills

Skills 使用 CLI 进行管理，类似 npm 的包管理方式：

```bash
# 浏览所有可用的 Skills
npx skills find

# 搜索特定领域的 Skills
npx skills find ui design

# 安装 Skill（来自 GitHub 或其他源）
npx skills add <package>

# 检查更新
npx skills check

# 更新所有 Skills
npx skills update
```

### 4.2 配置 Skills 加载

Skills 加载由 Agent 配置文件控制，通常在 `.opencode/` 目录下。

```jsonc
// opencode.jsonc
{
  "skills": [
    "ui-ux-pro-max",
    "find-skills"
  ]
}
```

配置完成后，Agent 会在匹配的任务场景下自动加载对应的 Skill 知识。

### 4.3 本地 Skills 目录结构

```text
~/.opencode/skills/
├── ui-ux-pro-max/
│   ├── SKILL.md          # Skill 定义和工作流
│   ├── data/             # 结构化知识数据
│   │   ├── styles.csv
│   │   ├── colors.csv
│   │   ├── typography.csv
│   │   └── ux-guidelines.csv
│   └── scripts/          # 辅助脚本
│       ├── search.py
│       └── design_system.py
│
~/.agents/skills/
├── find-skills/
│   └── SKILL.md
```

## 5. 前端开发中的实际应用

### 5.1 UI 设计系统快速搭建

使用 UI/UX Skills，Agent 可以直接获取：

- 根据产品类型推荐配色方案和字体搭配
- 给出完整的 Design System 规范（样式、颜色、间距、效果）
- 指出该场景下应避免的反模式

**价值**：减少设计师和前端之间的反复沟通，让页面初稿更接近最终设计方向。

### 5.2 框架规范对齐

团队框架 Skill 封装后，Agent 生成代码时会自动遵循：

- 目录结构和文件命名约定
- 组件设计模式和 props 规范
- 状态管理和数据流的最佳实践
- 样式方案的选择和约束

**价值**：多人协作时代码风格统一，减少 Code Review 中的规范类问题。

### 5.3 测试策略自动化

测试 Skill 加载后，Agent 在开发功能时可以：

- 自动生成单元测试和组件测试
- 补充边界条件和异常场景
- 检查测试覆盖率是否达标
- 识别可测试性差的设计

**价值**：测试不再是"事后补"，而是开发流程中自动完成的一环。

### 5.4 代码审查辅助

Code Review Skill 可以在 PR 审查时自动：

- 检查是否遵循团队代码规范
- 识别潜在的性能问题
- 发现常见的安全漏洞模式
- 对比是否满足组件复用原则

**价值**：减少审查者重复劳动，把精力留给真正需要评审的业务逻辑。

### 5.5 新技术栈迁移

当团队引入新框架时，对应的 Skills 可以：

- 提供新旧框架的 API 对照
- 给出迁移步骤和注意事项
- 识别不兼容的模式并自动修正
- 输出迁移后的验证检查清单

**价值**：降低技术栈迁移的学习成本和出错概率。

## 6. 前端团队推荐的第一批 Skills

如果是前端团队落地 Skills，建议第一阶段先配置这几类：

1. **UI/UX 设计 Skill** — 设计系统生成和样式推荐
2. **框架规范 Skill** — 团队使用的框架（React / Vue / Nuxt）最佳实践
3. **测试 Skill** — 单元测试和组件测试模板
4. **代码规范 Skill** — ESLint / Prettier / 命名规范
5. **组件库 Skill** — 内部组件库的使用规范和示例

这套组合已经能覆盖大部分高频工作：

- 写页面时自动对齐设计规范
- 开发时自动遵循框架最佳实践
- 提交前自动生成测试用例
- Code Review 时自动检查规范
- 组件使用时实时查询规范用法

## 7. 落地时的注意点

最常见的几个误区：

- **企图一个 Skill 覆盖所有场景** — 每个 Skill 应聚焦单一领域，保持小巧和可组合
- **Skill 数据和指令不及时更新** — 团队规范变化后要及时更新 Skill 数据
- **不区分 Skill 的触发场景** — 合理配置 Skill 的自动触发条件，避免"什么都加载"
- **Skill 知识缺少上下文** — 纯文字规范效果有限，配合实际代码示例效果更好

更稳妥的做法是：

- 先引入官方成熟 Skill，再定制团队私有 Skill
- Skill 知识先从小范围验证，再推广全团队
- 定期 Review Skill 数据的时效性和准确性
- 鼓励团队贡献和更新 Skill 内容

## 8. 总结

Skills 的本质，是为 AI Agent 注入专业领域知识的结构化方式。

对前端团队来说，它最直接的价值是把：

- **设计规范**
- **框架实践**
- **测试策略**
- **代码规范**
- **组件用法**

沉淀为可复用、可更新、可共享的 AI 知识包，让 Agent 从"通用助手"变成"团队专家"。

Skills 和 MCP 的关系：

- **MCP** 解决的是"AI 能做什么"（连接外部工具和数据）
- **Skills** 解决的是"AI 怎么做才专业"（领域知识和最佳实践）
- 两者互补，共同构成 AI 辅助研发的完整能力层

## 9. 参考资料

- Skills CLI 使用指南：`npx skills --help`
- Skills 市场浏览：[https://skills.sh/](https://skills.sh/)
- Skills GitHub 组织：[https://github.com/agent-skills](https://github.com/agent-skills)
- OpenCode Skills 配置文档：[https://opencode.ai](https://opencode.ai)

## 10. Skills 项目应用

### 1. 发现并安装 Skills

```bash
# 搜索 UI 设计相关的 Skills
npx skills find ui design

# 安装 UI/UX 设计 Skill
npx skills add <package-name>

# 验证安装
npx skills check
```

### 2. 配置 Agent 加载 Skills

在项目根目录的 `opencode.jsonc` 中添加 skills 配置：

```jsonc
{
  "skills": ["ui-ux-pro-max", "find-skills"]
}
```

或者通过 `.opencode/` 目录管理 Skills 配置：

```jsonc
// .opencode/skills.jsonc
{
  "autoLoad": true,
  "skills": [
    {
      "name": "ui-ux-pro-max",
      "trigger": ["design", "ui", "样式", "配色", "布局"],
      "autoLoad": true
    },
    {
      "name": "find-skills",
      "trigger": ["skill", "技能", "find", "搜索"],
      "autoLoad": false
    }
  ]
}
```

### 3. 使用 Skill 完成 UI 设计任务

- 前提：已安装 UI/UX 设计 Skill
- Agent 自动识别设计相关任务并加载 Skill 知识
- Skill 提供 Design System 生成、配色推荐、字体搭配等能力

```text
请帮我设计一个 SaaS 后台管理系统的页面，
包含：仪表盘、用户管理、订单管理三个模块。
风格偏好：简洁、专业、蓝色主色调。
```

Agent 加载 UI/UX Skill 后，会：

1. 根据产品类型（SaaS 后台）和风格关键词推荐配色方案
2. 生成完整的 Design System 规范
3. 给出该场景下推荐和避免的样式做法
4. 结合项目实际技术栈输出页面代码

**效果显著：Skills 让 AI 生成的设计更贴近专业水准。**
**长远目标：团队规范和经验不再是文档里吃灰的文字，而是 AI 随时可以调用的活知识。**

像以下这类常见问题，无需人工逐一叮嘱：

- 主色和辅助色如何搭配
- 不同层级的文字字号如何选择
- 卡片和列表的间距规范
- 表单组件的对齐和布局规则

这些专业但琐碎的设计决策，Skill 均可自动提供最佳实践参考。

开发者从此得以聚焦更高价值的工作：
**业务逻辑实现、用户体验创新与系统架构设计。**

-----------------------

## 最后

Skills 的价值不只在于"能用"，更在于"用得专业"。