# 部署 VitePress 站点到 GitHub Pages

部署地址 [https://fejason.github.io/](https://fejason.github.io/)

1. 在`github`上创建仓库 <fejason.github.io>

2. 将`vitePress`项目，推送至仓库

3. 在仓库设置工作流
`Settings` -> `Pages` -> `Build and deployment` 选择 `GitHub Actions`

4. 设置工作流 
`Actions` -> `New workflow` -> `set up a workflow yourself` -> .github/workflows 新建 deploy.yml -> `Commit changes...`

deploy.yml

```yml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: 将VitePress站点部署到Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消此区域注释
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: yarn install # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: yarn docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist # 指定要上传的文件路径，当前是根目录。如果是 docs 需要加 docs/ 前缀：docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Commit提交后，站点将在每次推送到 main 分支时自动部署。