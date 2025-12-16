# React 核心规则详解

React 的强大不仅源于其声明式 UI 能力，更依赖于一套**严格但清晰的规则体系**。遵循这些规则，是写出可预测、高性能、可维护 React 应用的前提。本文将系统阐述 React 的三大核心规则：

1. **组件和 Hook 必须是纯粹的（Pure）**
2. **React 调用组件和 Hook 的机制**
3. **Hook 的使用规则（Rules of Hooks）**

---

## 一、组件和 Hook 必须是纯粹的（Pure）

### 什么是“纯粹”？

在 React 中，“纯粹”意味着：**相同的输入（props / state / 参数）必须始终产生相同的输出（JSX / 返回值），且不产生副作用（Side Effects）**。

> 这是函数式编程的核心思想，也是 React 响应式更新模型的基础。

---

### 非纯粹组件的典型反例

```jsx
// 反例 1：直接修改全局变量
let globalCount = 0
function BadCounter({ increment }) {
  if (increment) {
    globalCount++ // ❌ 副作用：修改外部状态
  }
  return <div>{globalCount}</div>
}

// 反例 2：在渲染中生成随机数
function BadRandom() {
  return <div>{Math.random()}</div> // ❌ 每次渲染结果不同！
}

// 反例 3：在组件体中发起 API 请求
function BadDataFetcher() {
  // ❌ 副作用：请求会被重复触发（灾难性后果），正确做法：把副作用移到 useEffect
  fetch('/api/data')
  return <div>...</div>
}
```

这些问题会导致：

- **不可预测的渲染结果**
- **难以调试的状态 bug**
- **并发渲染（Concurrent Rendering）下行为异常**

---

### 正确做法：分离“计算”与“副作用”

| 任务类型                               | 应该放在哪里               |
| -------------------------------------- | -------------------------- |
| **计算派生数据**（如格式化、过滤）     | 组件函数体内（保持纯函数） |
| **副作用**（API 请求、订阅、DOM 操作） | `useEffect`、事件处理器中  |

```jsx
// 纯粹组件：只做渲染
function UserProfile({ user }) {
  // 纯计算：无副作用
  const displayName = user.firstName + ' ' + user.lastName
  const isActive = user.lastLogin > Date.now() - 86400000

  return <div className={isActive ? 'active' : 'inactive'}>{displayName}</div>
}

// 副作用放在 useEffect
function UserContainer({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 副作用：数据获取
    fetchUser(userId).then(setUser)
  }, [userId])

  return user ? <UserProfile user={user} /> : <Loading />
}
```

---

### 纯粹性带来的好处

- **可预测性**：给定 props，输出永远一致
- **可缓存性**：React 可安全跳过重复渲染（通过 `memo`）
- **并发安全**：支持 React 18+ 的并发特性（如 Suspense、Transition）
- **易于测试**：无需 mock 全局状态，直接断言输出

---

## 二、React 如何调用组件和 Hook

理解 React 的**调用机制**，是掌握其工作原理的关键。

### 组件的调用方式

React **不是直接调用你的组件函数**，而是通过其协调（Reconciliation）算法，在需要时**多次调用**组件函数以获取最新 UI 描述。

```jsx
function MyComponent({ name }) {
  console.log('Rendered!') // 可能被调用多次！
  return <h1>Hello, {name}!</h1>
}
```

> **重要**：组件函数可能在一次用户交互中被调用多次（例如状态更新、父组件重渲染）。因此**绝不能依赖组件函数只执行一次**。

---

### Hook 的调用机制：基于顺序的“魔法”

React **不通过名称识别 Hook**，而是**依赖调用顺序**！

#### 示例：React 内部如何跟踪 Hook

```jsx
// 第一次渲染
useState(0)     → 分配第 1 个 Hook，初始值 0
useEffect(...)  → 分配第 2 个 Hook

// 下次渲染
useState(0)     → 获取第 1 个 Hook 的当前值
useEffect(...)  → 获取第 2 个 Hook
```

只要每次渲染的 Hook **调用顺序一致**，React 就能正确关联状态。

---

### 破坏调用顺序的危险写法

```jsx
// 千万不要这样做！
function BadComponent({ showExtra }) {
  const [count, setCount] = useState(0)

  if (showExtra) {
    const [extra, setExtra] = useState('') // ❌ 条件调用 Hook！
  }

  useEffect(() => {
    // ...
  })

  return <div>{count}</div>
}
```

**后果**：

- 第一次渲染：Hook 顺序为 `[useState, useEffect]`
- 第二次 `showExtra=true`：顺序变为 `[useState, useState, useEffect]`
- React 会把第二个 `useState` 的状态错配给 `useEffect` → **严重 bug！**

---

### 正确做法：始终在顶层调用 Hook

- **不要在条件语句中调用 Hook**
- **不要在循环中调用 Hook**
- **不要在嵌套函数中调用 Hook**

```jsx
// 正确：始终在顶层
function GoodComponent({ showExtra }) {
  const [count, setCount] = useState(0);
  const [extra, setExtra] = useState('');

  // 条件逻辑放在 Hook 内部或 JSX 中
  useEffect(() => {
    if (showExtra) {
      // 在 effect 内做条件逻辑
    }
  }, [showExtra]);

  return (
    <div>
      {showExtra && <input value={extra} onChange={...} />}
    </div>
  );
}
```

---

## 三、Hook 的官方规则（Rules of Hooks）

React 官方明确定义了两条必须遵守的规则：

> **Rule 1: Only Call Hooks at the Top Level**  
> **Rule 2: Only Call Hooks from React Functions**

---

### Rule 1: 只在顶层调用 Hook

**正确**：

```jsx
function MyComponent() {
  const [state, setState] = useState()
  useEffect(() => {})
  // ...
}
```

**错误**：

```jsx
// 条件调用
if (condition) {
  useState();
}

// 循环调用
for (...) {
  useEffect();
}

// 嵌套函数调用
function handleClick() {
  useState();
}
```

---

### Rule 2: 只从 React 函数中调用 Hook

**正确**：

- 在 **函数组件** 中调用
- 在 **自定义 Hook**（以 `use` 开头的函数）中调用

```jsx
// 自定义 Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    // ...
  })
  return [value, setValue]
}

// 在组件中使用
function App() {
  const [name, setName] = useLocalStorage('name', '')
}
```

**错误**：

- 在普通 JavaScript 函数中调用
- 在 class 组件中调用
- 在事件处理器中直接调用

```jsx
// 普通函数 —— 不行！
function fetchData() {
  const [data, setData] = useState(null) // ❌
}

// 事件处理器 —— 不行！
function handleClick() {
  useEffect(() => {}) // ❌
}
```

---

### 如何强制遵守 Hook 规则？

React 提供了 **ESLint 插件**自动检测违规：

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// .eslintrc.js
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

> 启用后，任何违反规则的代码都会在开发时立即报错！

---

## 四、常见问题与最佳实践

### Q1: 如何处理“仅在某些条件下初始化状态”？

❌ 错误：

```js
if (props.shouldInit) {
  useState(initialValue)
}
```

✅ 正确：使用函数式初始化 + 条件逻辑

```js
const [state, setState] = useState(() => {
  if (props.shouldInit) {
    return computeExpensiveValue(props)
  }
  return null
})
```

---

### Q2: 如何避免在循环中调用 Hook？

❌ 错误：

```js
items.map(item => {
  const [state, setState] = useState() // ❌
})
```

✅ 正确：提取子组件

```jsx
function Item({ item }) {
  const [state, setState] = useState() // ✅ 每个实例独立
  return <div>{state}</div>
}

function List({ items }) {
  return items.map(item => <Item key={item.id} item={item} />)
}
```

---

### Q3: 自定义 Hook 必须以 `use` 开头吗？

**是的！** 这不仅是约定，更是 ESLint 插件识别 Hook 的依据。

```js
// ✅ 正确命名
function useAuth() { ... }
function useLocalStorage() { ... }

// ❌ 不会被识别为 Hook
function getAuth() { ... } // ESLint 不会检查它！
```

---

## 五、总结：React 规则的核心思想

| 规则          | 目的           | 关键原则                         |
| ------------- | -------------- | -------------------------------- |
| **纯粹性**    | 保证可预测性   | 无副作用、相同输入 → 相同输出    |
| **调用机制**  | 支持高效更新   | 基于顺序的 Hook 跟踪             |
| **Hook 规则** | 避免运行时错误 | 顶层调用 + 仅在 React 函数中调用 |

> **记住**：React 的规则不是限制，而是**解放**——  
> 它们让你专注于“描述 UI 应该是什么样子”，而不用操心“如何更新 DOM”。

遵循这些规则，你就能写出：

- **健壮** 的组件（无隐藏副作用）
- **高效** 的应用（React 可优化渲染）
- **可维护** 的代码（逻辑清晰、易于测试）

---

> **延伸阅读**
>
> - [React 官方文档：Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
> - [React 官方文档：Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
> - [React 并发渲染原理](https://react.dev/blog/2022/03/29/react-v18)
