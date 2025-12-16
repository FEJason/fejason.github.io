# React Hook

React 的 **Hooks** 是函数式组件的核心能力，自 React 16.8 引入以来，彻底改变了组件的编写方式。

下面详细介绍 **最常用、最关键的 7 个内置 Hook**，包括原理、用法、最佳实践和典型场景。

---

## 1. `useState` —— 管理组件内部状态

### 作用

让函数组件拥有“记忆”能力，保存和更新可变数据（如表单值、开关状态等）。

### 基本用法

```jsx
const [state, setState] = useState(initialValue)
```

- `state`：当前状态值
- `setState`：更新状态的函数
- `initialValue`：初始值（可以是值或函数）

### 示例

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: 'Alice' })

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>

      <p>Name: {user.name}</p>
      <button onClick={() => setUser({ ...user, name: 'Bob' })}>改名</button>
    </div>
  )
}
```

### 注意事项

- **状态更新是异步的**，不要依赖当前 state 立即获取新值。
- **对象/数组更新需不可变（immutable）**：使用展开运算符 `...` 创建新引用。
- **函数式更新**（推荐用于依赖前一状态）：
  ```js
  setCount(prev => prev + 1) // 安全，避免闭包问题
  ```

### 典型场景

- 表单输入控制
- UI 开关（模态框、折叠面板）
- 本地缓存简单数据

---

## 2. `useEffect` —— 处理副作用（Side Effects）

### 作用

在函数组件中执行**副作用操作**，如数据获取、订阅、手动 DOM 操作等。

### 基本用法

```jsx
useEffect(() => {
  // 副作用逻辑（如 API 调用）

  return () => {
    // 可选：清理函数（如取消订阅）
  }
}, [dependencies]) // 依赖数组
```

### 三种常见模式

| 依赖数组   | 行为                 | 类比 class 组件      |
| ---------- | -------------------- | -------------------- |
| `[]`       | 仅在挂载时执行一次   | `componentDidMount`  |
| `[a, b]`   | 当 a 或 b 变化时执行 | `componentDidUpdate` |
| 无依赖数组 | 每次渲染后都执行     | 不推荐               |

### 示例：数据获取

```jsx
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 组件挂载时获取数据
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => {
        setUser(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // 空依赖数组：只执行一次（类似 componentDidMount）

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}

export default App
```

### 注意事项

- **依赖数组必须包含所有用到的外部变量**（ESLint 插件会提示）
- **避免在 useEffect 中执行高开销同步操作**
- **清理函数用于释放资源**：定时器、事件监听、WebSocket 等

### 典型场景

- 发起 HTTP 请求
- 订阅 WebSocket / 事件
- 手动修改 DOM（如设置 title）
- 日志埋点

---

## 3. `useContext` —— 消费 Context 数据

### 作用

在函数组件中读取 **Context** 的值，实现跨层级组件通信。

### 基本用法

```jsx
const value = useContext(MyContext)
```

### 示例：主题切换

```jsx
// 1. 创建 Context
const ThemeContext = createContext('light')

// 2. 在深层组件中使用
function ThemedButton() {
  const theme = useContext(ThemeContext) // 直接获取，无需 props
  return <button className={theme}>按钮</button>
}

// 3. 父组件提供值
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  )
}
```

### 注意事项

- **Context 更新会导致所有 Consumer 重渲染** → 注意性能
- **不要滥用**：仅用于真正需要“穿透”多层的数据（如主题、用户、语言）
- **可封装自定义 Hook 提升可读性**：
  ```js
  export const useTheme = () => useContext(ThemeContext)
  ```

### 典型场景

- 全局主题（dark/light）
- 用户认证状态
- 国际化（i18n）
- 应用配置

---

## 4. `useRef` —— 访问 DOM 或保存可变值

### 作用

- 获取真实 DOM 元素引用
- 保存一个**跨渲染周期不变**的可变值（类似 class 实例属性）

### 基本用法

```jsx
const ref = useRef(initialValue)
// ref.current 可读可写
```

### 示例 1：聚焦输入框

```jsx
function InputFocus() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus() // 聚焦
  }, [])

  return <input ref={inputRef} />
}
```

### 示例 2：保存上一次 state

```jsx
function PrevState({ value }) {
  const prevRef = useRef()

  useEffect(() => {
    prevRef.current = value
  }, [value])

  return (
    <div>
      当前: {value}, 上次: {prevRef.current}
    </div>
  )
}
```

### 注意事项

- **修改 `ref.current` 不会触发 re-render**
- **不要用于存储普通状态**（应使用 `useState`）

### 典型场景

- 自动聚焦、滚动到元素
- 保存定时器 ID
- 记录组件渲染次数
- 保存上一次 props/state 值

---

## 5. `useReducer` —— 管理复杂状态逻辑

### 作用

当状态逻辑较复杂（多个子值、依赖前一状态、多 action 类型）时，替代 `useState`。

### 基本用法

```jsx
const [state, dispatch] = useReducer(reducer, initialState)
```

- `reducer`：纯函数 `(state, action) => newState`
- `dispatch`：触发状态更新 `(action) => void`

### 示例：计数器（带重置）

```jsx
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return initialState
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  )
}
```

### 注意事项

- **reducer 必须是纯函数**（无副作用）
- **适合状态逻辑集中管理**（类似 Redux）

### 典型场景

- 表单状态机（验证、提交、重置）
- 购物车（增删改商品）
- 复杂 UI 状态（步骤向导、多面板控制）

---

## 6. `useCallback` —— 缓存函数（避免子组件不必要重渲染）

### 作用

返回一个 **memoized（记忆化）的回调函数**，防止因父组件 re-render 导致子组件 props 函数引用变化。

### 基本用法

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b]) // 依赖数组
```

### 示例：优化子组件

```jsx
function Parent() {
  const [count, setCount] = useState(0)

  // ❌ 每次渲染都创建新函数 → Child 会 re-render
  // const handleClick = () => console.log('click');

  // ✅ 使用 useCallback 缓存
  const handleClick = useCallback(() => {
    console.log('click', count) // 如果依赖 count，需加入依赖数组
  }, [count])

  return (
    <div>
      <Child onClick={handleClick} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
    </div>
  )
}

// 子组件用 React.memo 包裹
const Child = React.memo(({ onClick }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>Child Button</button>
})
```

### 注意事项

- **必须配合 `React.memo` 才有效**
- **不要过早优化**：仅在子组件重渲染成为性能瓶颈时使用
- **依赖数组要完整**

### 典型场景

- 传递给 `React.memo` 子组件的回调
- 作为 `useEffect` 依赖的函数

---

## 7. `useMemo` —— 缓存计算结果

### 作用

缓存昂贵的计算结果，避免每次渲染都重新计算。

### 基本用法

```jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b]) // 依赖数组
```

### 示例：过滤列表

```jsx
function UserList({ users, filterText }) {
  // ❌ 每次渲染都过滤 → 性能差
  // const filteredUsers = users.filter(u => u.name.includes(filterText));

  // ✅ 仅当 users 或 filterText 变化时重新计算
  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.includes(filterText))
  }, [users, filterText])

  return (
    <ul>
      {filteredUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### 注意事项

- **不要用于简单计算**（如 `a + b`），开销可能大于收益
- **主要用于：排序、过滤、复杂对象创建**

### 典型场景

- 列表过滤/排序
- 派生数据计算（如统计信息）
- 创建稳定对象引用（避免子组件 re-render）

---

## 总结：核心 Hooks 对比表

| Hook          | 主要用途          | 是否触发 re-render              | 典型场景       |
| ------------- | ----------------- | ------------------------------- | -------------- |
| `useState`    | 管理简单状态      | ✅ 是                           | 表单、UI 开关  |
| `useEffect`   | 副作用处理        | ❌ 否（但可能间接触发）         | API 请求、订阅 |
| `useContext`  | 跨组件传值        | ✅ 是（当 Provider value 变化） | 主题、用户状态 |
| `useRef`      | DOM 引用 / 持久值 | ❌ 否                           | 聚焦、保存值   |
| `useReducer`  | 复杂状态逻辑      | ✅ 是                           | 表单、购物车   |
| `useCallback` | 缓存函数          | ❌ 否                           | 优化子组件     |
| `useMemo`     | 缓存计算结果      | ❌ 否                           | 过滤、排序     |

---

## 最佳实践建议

1. **优先使用 `useState` + `useEffect`**：它们覆盖 80% 场景。
2. **Context 不要滥用**：仅用于真正全局的数据。
3. **`useCallback` / `useMemo` 按需使用**：先 profile 性能，再优化。
4. **自定义 Hook 封装逻辑**：如 `useFetch`, `useLocalStorage`。
5. **依赖数组要诚实**：包含所有用到的外部变量。

---

掌握这 7 个 Hook，你就掌握了现代 React 开发的**核心武器库**！它们共同构成了函数式组件强大而简洁的编程模型。
