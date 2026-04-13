# React Router 7.9.5

React Router 是一个用于 React 的多策略路由工具。它主要有三种使用方式，或者说“模式”。

官方文档地址：https://reactrouter.com/7.9.5/start/modes

- 声明式模式
- 数据模式
- 框架模式

| 模式                         | API                    | 典型用途     |
| ---------------------------- | ---------------------- | ------------ |
| Declarative（声明式模式）    | `<Routes>` / `<Route>` | 轻量 SPA     |
| Data Router（数据模式）      | `createBrowserRouter`  | **主流推荐** |
| Framework Router（框架模式） | Remix / Next           | 全栈框架     |

现在主要介绍第二种：数据模式

React Router 的「数据路由（Data Router）」
可以覆盖 99% Vue Router 的使用场景，而且在很多点上是“超集”。

# Vue Router 的核心能力，Data Router 能不能覆盖？

看一张对照表：

| Vue Router 能力 | Data Router 是否覆盖 | 对应能力                     |
| --------------- | -------------------- | ---------------------------- |
| routes 路由表   | ✅                   | RouteObject                  |
| 嵌套路由        | ✅                   | children + `<Outlet />`      |
| 动态路由        | ✅                   | `:id`                        |
| query           | ✅                   | `useSearchParams`            |
| meta            | ✅                   | `handle`                     |
| beforeEach      | ✅                   | middleware / loader          |
| beforeEnter     | ✅                   | route middleware             |
| return false    | ✅                   | 不调用 next / throw redirect |
| 异步守卫        | ✅                   | async middleware             |
| 路由重定向      | ✅                   | redirect()                   |
| 组件守卫        | ✅                   | `<Navigate />`               |
| 滚动行为        | ⚠️                   | 自行实现                     |
| keep-alive      | ❌（核心不含）       | react-activation             |

结论：

**Vue Router 的“路由能力”，Data Router 全部覆盖**

---

# 把一个完整 Vue Router 项目迁移到 Data Router

下面我**按真实企业项目的迁移节奏**，把
**「一个完整 Vue Router 项目 → React Router Data Router」**
**一步一步对齐**。

---

# 一、迁移总原则（先稳住）

> ❗ **Vue → React 路由迁移，90% 的坑不是语法，是“设计方式”**

### 三条铁律（非常重要）

1. **先迁路由结构，不迁业务**
2. **Vue 的 meta / 守卫，全部先原样映射**
3. **不要一开始就引入 loader 重构请求逻辑**

---

# 二、Vue Router 典型项目长什么样（原型）

```js
// router/index.js (Vue)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: 'home',
          component: Home,
          meta: { title: '首页' }
        },
        {
          path: 'user/:id',
          component: User,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin()) {
    next('/login')
  } else {
    next()
  }
})
```

---

# 三、第一步：**只迁路由表（100% 对齐）**

## 1️⃣ Vue routes → React RouteObject

```js
// router/routes.js
import Layout from '@/layout/Layout'
import Home from '@/pages/Home'
import User from '@/pages/User'
import Login from '@/pages/Login'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />,
        handle: { title: '首页' } // meta → handle
      },
      {
        path: 'user/:id',
        element: <User />,
        handle: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]
```

✅ children 对齐
✅ 动态路由对齐
✅ meta → handle（原样迁）

---

## 2️⃣ 创建 Data Router

```js
// router/index.js
// 数据模式写法
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

export const router = createBrowserRouter(routes)

export function AppRouter() {
  return <RouterProvider router={router} />
}

// 对比声明式模式
{
  /* <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter> */
}
```

---

# 四、第二步：迁「全局路由守卫」

## Vue 的 beforeEach 是什么本质？

> **“在进入页面前，做一次统一判断”**

### 在 Data Router 中有 2 种对等方案

---

## 方案一：middleware（最像 Vue）

```js
// router/middleware/auth.js
import { redirect } from 'react-router-dom'

export async function authMiddleware({ matches }) {
  const needAuth = matches.some(m => m.handle?.requiresAuth)

  if (needAuth && !isLogin()) {
    throw redirect('/login')
  }
}
```

---

### 绑定为「全局守卫」

```js
// router/index.js
import { authMiddleware } from './middleware/auth'

export const router = createBrowserRouter(routes, {
  middleware: [authMiddleware]
})
```

### ✅ 这一步 = Vue router.beforeEach

| Vue            | React               |
| -------------- | ------------------- |
| beforeEach     | middleware          |
| next(false)    | 不调用 next / throw |
| next('/login') | throw redirect      |

---

## 方案二：`loader`（稳定方案）

> **这是 React Router 官方 v6.4 以来的主推方案**

---

### 1️⃣ loader 的定位

```txt
导航到某个路由
  → 执行该路由的 loader
    → 返回数据 or redirect
```

### loader 本质是：

> **“进入这个页面前，先准备好数据，否则不让进”**

---

### 2️⃣ loader 做权限守卫（官方推荐写法）

```js
// router/loader/auth.js
import { redirect } from 'react-router-dom'

export async function authLoader() {
  if (!isLogin()) {
    throw redirect('/login')
  }
  return null
}
```

```js
{
  path: '/admin',
  loader: authLoader,
  element: <Admin />
}
```

---

### 3️⃣ loader vs middleware 的关键区别

| 对比项        | middleware    | loader           |
| ------------- | ------------- | ---------------- |
| 作用范围      | 全局 / 路由级 | 路由级           |
| 执行时机      | **最早**      | 在 middleware 后 |
| 是否推荐      | 新特性        | **最稳定**       |
| 是否依赖数据  | ❌            | ✅               |
| 是否 SSR 友好 | ✅            | ✅               |
| 类似 Vue      | beforeEach    | beforeEnter      |

---

# 五、第三步：迁 useRoute / useRouter（Vue 用户最关心）

## useRouter（对齐 router.push）

```js
// router/useRouter.js
import { useNavigate } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()

  return {
    push: to => navigate(to),
    replace: to => navigate(to, { replace: true }),
    back: () => navigate(-1)
  }
}
```

---

## useRoute（对齐 useRoute）

```js
// router/useRoute.js
import {
  useLocation,
  useParams,
  useSearchParams,
  useMatches
} from 'react-router-dom'

export function useRoute() {
  const location = useLocation()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const matches = useMatches()

  return {
    path: location.pathname,
    fullPath: location.pathname + location.search,
    params,
    query: Object.fromEntries(searchParams),
    meta: Object.assign({}, ...matches.map(m => m.handle || {}))
  }
}
```

👉 Vue 的 `route.meta.xxx`，**一行都不用改**

---

# 六、第四步：迁组件级路由守卫

## Vue

```ts
beforeRouteEnter(to, from, next) {}
```

---

## React（组件内）

```js
import { Navigate } from 'react-router-dom'

export default function User() {
  if (!hasPermission()) {
    return <Navigate to="/403" replace />
  }

  return <div>User</div>
}
```

✔️ 语义等价
✔️ 更直观

---

# 七、第五步：KeepAlive

## Vue

```vue
<keep-alive>
  <router-view />
</keep-alive>
```

---

## React：react-activation（行业标准）

```bash
npm i react-activation
```

### 挂 Provider

```js
import { AliveScope } from 'react-activation'

ReactDOM.createRoot(el).render(
  <AliveScope>
    <AppRouter />
  </AliveScope>
)
```

---

### 路由中使用

```js
import { KeepAlive } from 'react-activation'

{
  path: 'home',
  element: (
    <KeepAlive name="home">
      <Home />
    </KeepAlive>
  )
}
```

### 组件激活时触发

```jsx
import { useActivate } from 'react-activation'

useActivate(() => {
  // 组件激活时触发
})
```

✔️ Vue keep-alive 100% 对齐
✔️ 可精确控制

---

# 九、迁移完成后的能力对齐表（最终态）

| Vue Router       | React Data Router             |
| ---------------- | ----------------------------- |
| routes           | routes                        |
| meta             | handle                        |
| beforeEach       | useEffect、middleware、loader |
| beforeRouteEnter | 组件内                        |
| useRouter        | useNavigate                   |
| useRoute         | useLocation + useMatches      |
| keep-alive       | react-activation              |

---

# 十、最终结论

> ✅ **Vue Router 项目可以“等价迁移”到 Data Router**
>
> - 不丢能力
> - 不重写业务
> - 不改变路由语义
>
> ❗ 唯一变化的是：
> **“集中式 router 对象 → hook + middleware 组合”**

---
