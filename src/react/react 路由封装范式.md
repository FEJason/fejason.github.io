# React 路由封装

**「React 项目中最主流、最稳妥」的路由封装范式**，把你熟悉的 **Vue Router 常用能力一一对齐**。

> 基于：**React 18/19 + react-router-dom v6.4+（官方推荐）**

---

## 一、整体设计原则（先说结论）

**React 路由封装的核心原则只有 3 条：**

1. **不造轮子**（不搞全局 router 单例）
2. **基于 hooks + 官方 API**
3. **把「跳转 / 守卫 / 参数」拆成小工具，而不是一个大 router 对象**

👉 和 Vue 最大的不同点：
**React 是「组合」，Vue 是「集中对象」**

---

## 二、项目目录结构（行业主流）

```txt
src/
├─ router/
│  ├─ routes.tsx        # 路由表
│  ├─ guard.ts          # 路由守卫
│  ├─ useRoute.ts       # useRoute 封装
│  ├─ useRouter.ts      # useRouter 封装
│  └─ index.tsx         # router 实例
├─ pages/
│  ├─ Home.tsx
│  └─ User.tsx
└─ main.tsx
```

---

## 三、路由表（≈ vue-router routes）

```tsx
// router/routes.tsx
import type { RouteObject } from 'react-router-dom'
import Home from '@/pages/Home'
import User from '@/pages/User'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/user/:id', // 动态路由
    element: <User />,
    handle: {
      requiresAuth: true // meta
    }
  }
]
```

✔️ 动态路由
✔️ meta（handle）
✔️ 嵌套也支持（children）

---

## 四、路由创建与挂载

```tsx
// router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

export const router = createBrowserRouter(routes)

export function AppRouter() {
  return <RouterProvider router={router} />
}
```

```tsx
// main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(<AppRouter />)
```

---

## 五、路由跳转（≈ router.push）

### 官方写法（推荐）

```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

navigate('/login')
navigate('/user/1')
navigate(-1)
```

---

### 封装一个 useRouter（Vue 用户更习惯）

```ts
// router/useRouter.ts
import { useNavigate } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()

  return {
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    back: () => navigate(-1)
  }
}
```

使用：

```ts
const router = useRouter()
router.push('/user/1')
```

---

## 六、获取路由信息（≈ useRoute）

```ts
// router/useRoute.ts
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

export function useRoute() {
  const location = useLocation()
  const params = useParams()
  const [searchParams] = useSearchParams()

  return {
    path: location.pathname,
    fullPath: location.pathname + location.search,
    params,
    query: Object.fromEntries(searchParams)
  }
}
```

使用：

```ts
const route = useRoute()
route.params.id
route.query.page
```

---

## 七、路由守卫（重点，对应 beforeEach）

### React 官方方案：**loader（强烈推荐）**

```ts
// router/guard.ts
import { redirect } from 'react-router-dom'

export async function authGuard() {
  const isLogin = Boolean(localStorage.getItem('token'))

  if (!isLogin) {
    throw redirect('/login')
  }
  return null
}
```

```ts
// routes.tsx
{
  path: '/admin',
  loader: authGuard,
  element: <Admin />,
}
```

✔️ 更早执行
✔️ 支持 async
✔️ 支持服务端
✔️ 比 vue-router 守卫更强

---

### 全局守卫（模拟 beforeEach）

```ts
import { useMatches } from 'react-router-dom'

export function useAuthGuard() {
  const matches = useMatches()

  const needAuth = matches.some(m => m.handle?.requiresAuth)

  if (needAuth && !isLogin()) {
    return <Navigate to="/login" replace />
  }

  return null
}
```

---

## 八、动态路由（Vue 迁移重点）

### 路由定义

```ts
{
  path: '/user/:id',
  element: <User />,
}
```

### 读取参数

```ts
const { id } = useParams()
```

### 跳转

```ts
navigate(`/user/${id}`)
```

✔️ 与 vue-router 语义一致

---

## 九、权限 + 菜单（常见企业需求）

```ts
{
  path: '/system',
  element: <Layout />,
  handle: {
    title: '系统管理',
    roles: ['admin'],
  },
}
```

```ts
const matches = useMatches()
matches.map(m => m.handle?.title)
```

---

## 十、Vue Router → React Router 对照表

| Vue Router     | React Router            |
| -------------- | ----------------------- |
| router.push    | navigate                |
| router.replace | navigate({ replace })   |
| useRouter      | useNavigate             |
| useRoute       | useLocation + useParams |
| beforeEach     | loader / Navigate       |
| meta           | handle                  |
| 动态路由       | :id                     |
| router-view    | Outlet                  |

---

## 十一、总结（给你一个标准答案）

> **React 项目中路由的“正确封装方式”是：**
>
> - 用 `react-router-dom` 官方 API
> - 跳转封装成 `useRouter`
> - 路由信息封装成 `useRoute`
> - 守卫用 `loader`（而不是生命周期）
> - meta 用 `handle`
> - 不做全局 router 单例

---

如果你愿意，我可以：

- 🔁 **把你现有的 Vue Router 配置直接翻译成 React**
- 🧩 给你一个 **可直接用的企业级路由模板**
- 🔐 帮你做「动态权限路由 + 菜单」

直接贴你现在的 `routes` 配置即可。

# react 项目，真实项目中最常用的路由封装方式，需要包含以下内容：

- 路由表，支持懒加载、支持路由元信息 meta 配置、支持路由嵌套
- 使用 react-activation KeepAlive
- 获取路由信息、获取动态路由参数、获取 query 参数、获取 meta 信息
- 全局路由前置守卫，支持像 Vue 一样，返回 false 以取消导航；全局后置钩子
- 支持组件级的路由守卫
- 不使用 ts
