# 使用 Husky v9 实现提交前格式化代码

## 解决痛点

避免团队成员将没有格式化的代码提交上去。

## Husky 是什么

Husky 是一个用于增强 Git Hooks 的工具，它允许你在执行 Git 操作（如 commit、push 等）时自动运行自定义脚本。通过 Husky，你可以轻松地在项目的生命周期中集成质量检查、测试、代码格式化等步骤，确保代码库的整洁和一致性。

### Husky 主要特性

- Git Hooks 支持：Husky 提供了对 Git Hooks 的全面支持，包括 pre-commit、commit-msg、pre-push 等标准钩子。
- 简化配置：相比直接编辑 .git/hooks 目录下的文件，Husky 使得添加和管理 Git Hooks 更加简单直观。
- 与现代 JavaScript 工具链无缝集成：Husky 可以轻松地与 Linters（如 ESLint）、Formatters（如 Prettier）、Testing Frameworks（如 Jest）等结合使用。

### 使用场景示例

- Pre-commit Hook：在提交之前自动运行代码格式化工具或单元测试，确保代码符合项目规范且没有破坏现有功能。
- Commit Message Hook：验证提交信息是否遵循预定的格式，有助于维护清晰的版本历史。
- Pre-push Hook：在推送更改到远程仓库之前运行完整的测试套件，避免将问题引入生产环境。

## 格式化代码实现步骤

### 目标

> 在 Git 提交前（pre-commit 钩子）自动格式化代码，并只格式化即将提交的文件。

### 所需工具

- Husky：Git hooks 管理工具
- Prettier：代码格式化工具（或其他你喜欢的格式化器）
- lint-staged：仅对暂存区文件执行操作

### 步骤 1：安装依赖

```sh
npm install --save-dev husky prettier lint-staged
```

或者使用 yarn：

```sh
yarn add --dev husky prettier lint-staged
```

目前安装的最新版本：

```json
"devDependencies": {
  "husky": "^9.1.7",
  "lint-staged": "^16.1.2",
  "prettier": "^3.6.2",
}
```

### 步骤 2：初始化 Husky

```sh
npx husky init
```

这会创建 .husky 目录，并在 package.json 中添加如下脚本：

```json
"scripts": {
  "prepare": "husky"
}
```

以上脚本可以确保团队成员在执行 `npm install` 或 `yarn install` 时自动初始化 Husky，初始化 Husky 会在 .husky 目录下新增 `_` 文件夹，文件夹里面存放着 Husky 的脚本。

### 步骤 3：配置 lint-staged

在 package.json 中添加：

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json,css,scss,md,vue}": [
    "prettier --write"
  ]
},
```

以上配置匹配所有对应扩展名的文件（在 git add 后处于 staged 暂存状态的）

可以根据项目需要修改匹配的文件类型和格式化命令。

### 步骤 4：设置 pre-commit hook（使用 lint-staged）

```sh
# 这里默认 npm test 执行测试，可以删除
# npm test

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

保存后给它可执行权限（如果是 Linux/macOS）：

```sh
chmod +x .husky/pre-commit
```

## 查看效果

现在当你运行 git commit 提交暂存时：

- Husky 会触发 pre-commit 钩子；
- lint-staged 会找出你已 git add 添加到暂存的文件；
- 使用 Prettier 对这些文件进行格式化；
- 格式化后的更改将被自动加入提交（staged）；
- 如果格式化失败或报错，提交会被中断。

## 可选：自定义 Prettier 配置

在项目根目录添加 .prettierrc 文件，例如：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "arrowParens": "avoid"
}
```

## 测试一下

- 修改一个 .vue 或 .js 文件，不按 Prettier 的规则写代码。
- `git add <file>`
- `git commit -m "提交日志"`
- 观察是否自动格式化了代码并成功提交。

## 总结

| 工具        | 作用               |
| ----------- | ------------------ |
| Husky       | 管理 Git Hooks     |
| lint-staged | 仅处理已暂存的文件 |
| Prettier    | 自动格式化代码     |

## 补充

- 如果你用的是 ESLint，也可以结合 eslint --fix 一起使用。
- 推荐配合编辑器插件（如 VSCode 的 Prettier 插件）实时格式化。
- 团队协作中，记得共享 .prettierrc 和 .husky 配置。
