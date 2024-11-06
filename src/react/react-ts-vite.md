# 在 Vite 中使用 React

## 初始化 Vite 项目

Vite 需要 Node.js 版本 18+ 或 20+。

```sh
$ yarn create vite antd-demo
```

工具会自动初始化一个脚手架并安装 React 项目的各种必要依赖

## 引入 antd

```sh
$ yarn add antd
```

修改 src/App.js，引入 antd 的按钮组件。

```js
import React from "react";
import { Button } from "antd";

const App = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default App;
```

好了，现在你应该能看到页面上已经有了 antd 的蓝色按钮组件，接下来就可以继续选用其他组件开发应用了。其他开发流程你可以参考 Vite 的[官方文档](https://cn.vitejs.dev/)。

我们现在已经把 antd 组件成功运行起来了，开始开发你的应用吧！

## React 路由

安装

```sh
yarn add react-router-dom
```

### 添加路由器

首先要创建一个浏览器路由器并配置我们的第一个路由。这将为我们的 Web 应用启用客户端路由。

该 main.jsx 文件是入口文件。

src/main.jsx

```js
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### 嵌套路由

src/main.tsx

```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // 根组件
    children: [
      {
        path: "/",
        element: <Layout />, // 布局组件
        children: [
          {
            index: true, // 指定了一个路由配置项下的默认子路由
            element: <Home />, // 使用布局组件的页面
          },
          {
            path: "edit",
            element: <Edit />,
          },
        ],
      },
      {
        // 其它不需要使用布局组件的页面
      },
    ],
  },
]);
```

### 添加 scss

```sh
yarn add sass
```

### CSS Modules

class 命名，统一使用驼峰命名，在 React 项目中使用驼峰，可以减少转换，方便复制、粘贴、搜索

```scss

// styles.module.scss
.contentWrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// MyComponent.jsx
import styles from './styles.module.scss'

function MyComponent() {
  return (
    <div className={styles.contentWrap}></div>
  )
}

export default MyComponent
```

### ESLint

保存自动格式化代码

Vscode 安装插件

- ESLint
- Prettier - Code formatter
- Prettier ESLint

1. 配置 ESLint
   创建 eslint.config.js 文件配置 ESLint。这个文件将告诉 ESLint 使用哪些规则和插件。你可以根据项目需求进行调整。

2. 配置 Prettier
   Prettier 是一个代码格式化工具，可以与 ESLint 配合使用来确保代码格式的一致性。创建一个 .prettierrc 文件来配置 Prettier：

3. 配置编辑器（以 VSCode 为例）
   创建 .vscode 文件夹，配置 settings.json

```json
{
  "editor.formatOnPaste": true, // 开启粘贴时的自动格式化
  "editor.formatOnSave": true, // 开启保存时的自动格式化
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always" // 总是修复所有可以修复的 ESLint 问题
  }
}
```
