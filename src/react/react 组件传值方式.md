# React 组件传值

React 遵循单向数据流原则：数据从父组件流向子组件。

Vue 同样遵循“单向数据流”原则（在组件通信层面），但它通过响应式系统实现了更灵活的“双向绑定语法糖”，这容易让人误以为 Vue 是“双向数据流”。

React 组件传值的方式：

- 父组件向子组件传值（Props）
- 子组件向父组件传值（回调函数）
- 兄弟组件之间传值（通过共同父组件）
- 跨层级组件传值（Context）
- 任意组件间通信（状态管理库 zustand）
- 其他方式（Ref 转发、自定义事件 EventEmitter）

## 父组件 → 子组件（Props）

这是最基础、最常用的传值方式。

示例：

```jsx
// 父组件
function Parent() {
  const message = 'Hello from Parent'
  return <Child text={message} />
}

// 子组件
function Child({ text }) {
  return <div>{text}</div>
}
```

- 特点：
  - 单向传递（不可逆）
  - Props 是只读的（不能在子组件中修改）
  - 可传递任意类型：字符串、数字、对象、函数、JSX 元素等

## 子组件 → 父组件（回调函数）

子组件通过调用父组件传入的函数，将数据“传回”给父组件。

示例：

```jsx
// 父组件
function Parent() {
  const handleChange = data => {
    console.log('收到子组件数据:', data)
  }

  return <Child onChange={handleChange} />
}

// 子组件
function Child({ onChange }) {
  const handleClick = () => {
    onChange('Hello from Child')
  }

  return <button onClick={handleClick}>发送数据给父组件</button>
}
```

- 关键点：父组件定义函数 → 通过 props 传给子组件 → 子组件调用该函数并传参

## 兄弟组件之间传值（通过共同父组件）

两个子组件（兄弟）之间不能直接通信，需借助共同的父组件中转。

示例：

```jsx
function Parent() {
  const [sharedData, setSharedData] = useState('')

  return (
    <>
      <SiblingA onDataChange={setSharedData} />
      <SiblingB data={sharedData} />
    </>
  )
}

function SiblingA({ onDataChange }) {
  return (
    <input
      onChange={e => onDataChange(e.target.value)}
      placeholder="输入内容"
    />
  )
}

function SiblingB({ data }) {
  return <p>兄弟组件 B 收到: {data}</p>
}
```

## 跨层级组件传值（Context）

当组件嵌套很深（如 A → B → C → D），而 A 想直接传值给 D，使用 props 会形成“prop drilling”（逐层透传），此时可用 React Context。

示例：

```jsx
import { createContext } from 'react'

// 创建 Context
const MyContext = createContext()

// 祖先组件（Provider）
function App() {
  const value = '来自顶层的数据'
  return (
    {/* 用 Provider 包裹整个应用 */}
    <MyContext.Provider value={value}>
      <Level1 />
    </MyContext.Provider>
  )
}

// 中间组件（无需关心数据）
function Level1() {
  return <Level2 />
}

// 深层子组件（Consumer）
function Level2() {
  return <MyContext.Consumer>{value => <div>{value}</div>}</MyContext.Consumer>
}

// 或使用 useContext Hook（推荐）
function Level2() {
  const value = useContext(MyContext)
  return <div>{value}</div>
}
```

完整示例：

- App 根组件管理当前主题（light / dark）
- 有一个很深的子组件（比如 DeepChild）需要根据主题改变按钮样式
- 中间组件（如 Layout、Content）完全不关心主题，但传统 props 会强迫它们传递
  用 Context 可以让 DeepChild 直接“穿透”中间层获取主题！

### 1. 创建 Context

```jsx
// 将 Context 单独放在 contexts/ 目录下，便于管理
// contexts/ThemeContext.js
import { createContext, useContext } from 'react'

// 创建 Context
export const ThemeContext = createContext('light') // 默认 light

// 自定义 Hook（可选，但推荐）
export const useTheme = () => useContext(ThemeContext)
```

---

### 2. 根组件：提供主题状态

```jsx
// App.jsx
import React, { useState } from 'react';
import { ThemeContext } from './ThemeContext';
import Layout from './Layout';

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    {/* 用 Provider 包裹整个应用 */}
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ padding: '20px' }}>
        <h1>主题切换示例</h1>
        <Layout />
      </div>
    </ThemeContext.Provider>
  );
}
```

---

### 3. 中间组件（完全不处理主题）

```jsx
// Layout.jsx
import Content from './Content'

export default function Layout() {
  // 这个组件不需要知道 theme！
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h2>布局组件（中间层）</h2>
      <Content />
    </div>
  )
}
```

```jsx
// Content.jsx
import DeepChild from './DeepChild'

export default function Content() {
  // 这个组件也不需要知道 theme！
  return (
    <div style={{ margin: '10px 0' }}>
      <h3>内容区域（又一层中间组件）</h3>
      <DeepChild />
    </div>
  )
}
```

---

### 4. 深层子组件：直接使用主题

```jsx
// DeepChild.jsx
import { useTheme } from './ThemeContext'

export default function DeepChild() {
  // useTheme 是导出的 useContext Hook
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <p>
        当前主题: <strong>{theme}</strong>
      </p>
      {/* 按钮样式根据主题变化 */}
      <button
        onClick={toggleTheme}
        style={{
          background: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          padding: '8px 16px',
          border: '1px solid #999'
        }}
      >
        切换主题
      </button>
    </div>
  )
}
```

---

### 效果

- 点击 `DeepChild` 中的按钮 → 主题切换
- 整个应用（包括 `DeepChild`）立即响应新主题
- **中间组件 `Layout` 和 `Content` 完全无感知**，没有传递任何 props！

---

### 注意

- 如果只是父子组件通信 → **直接用 props**
- 如果状态变化非常频繁（如鼠标坐标）→ **慎用 Context**（会导致大量重渲染）
- 对于复杂状态 → 考虑 Zustand

---

这个主题切换例子是 React 官方文档的经典案例，也是理解 Context 价值的最佳入门场景。

## 任意组件间通信（状态管理库）

对于大型应用，组件关系复杂，可使用状态管理工具：

常见方案：

- Redux / Redux Toolkit：集中式状态管理
- Zustand /ˈzuːluːlænd/：轻量、简单、基于 Hooks
- MobX：响应式状态管理
- Jotai / Recoil：原子化状态（适合 React 并发特性）

Zustand 示例（极简）：

```jsx
import { create } from 'zustand'

const useStore = create(set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 }))
}))

// 任意组件使用
function ComponentA() {
  const count = useStore(state => state.count)
  return <div>{count}</div>
}

function ComponentB() {
  const inc = useStore(state => state.inc)
  return <button onClick={inc}>+1</button>
}
```

## 其他方式（不常用但存在）

### 1. Ref 转发（父访问子组件实例）

使用 forwardRef + useImperativeHandle 主动暴露，这是 React 提供的“可控式”暴露机制。

```jsx
const Child = forwardRef((props, ref) => {
  const [count, setCount] = useState(10)

  // 暴露 reset 方法
  useImperativeHandle(ref, () => ({
    getCount: () => count, // 暴露读取方法，父组件可以获取子组件的状态
    reset: () => {} // 暴露修改方法
    // 注意：不要直接暴露 count 值（因为是闭包快照）
  }))
})

function Parent() {
  const childRef = useRef()
  const handleClick = () => {
    // 调用子组件实例的 reset 方法
    console.log(childRef.current.reset())
  }
  return <Child ref={childRef} />
}
```

- 不推荐用于常规数据流，仅用于命令式操作（如聚焦、重置等）

关键点：

- 子组件必须主动决定暴露哪些内容。
- 父组件不能随意访问子组件的任意状态（符合 React 封装原则）。
- 这是一种显式契约，而非“窥探”。

为什么 React 不允许像 Vue 那样直接访问？
React 的设计哲学强调：

- 单向数据流
- 状态提升（Lifting State Up）
- 组件封装性：子组件的内部状态应由自己管理，外部不应随意干预

如果父组件需要知道子组件的状态，更推荐的方式是：

- 将状态提升到父组件（通过 props + 回调）
- 使用 Context 或状态管理库共享状态

### 2. 自定义事件（EventEmitter）

通过发布-订阅模式实现跨组件通信（一般用于非 React 原生场景或与第三方库集成），小程序就用到了。

在 React 中，**自定义事件（EventEmitter）** 是一种基于 **发布-订阅模式（Pub/Sub）** 的跨组件通信方式。它不依赖 React 的 props、state 或 Context，而是通过一个**全局事件中心**来实现任意组件之间的解耦通信。

虽然 React 官方并不推荐在常规业务中使用这种方式（因为会破坏数据流的可预测性和组件封装性），但在以下场景中非常有用：

- 与非 React 代码集成（如原生 JS 模块、第三方库）
- 跨层级、跨树的松耦合通信（如微前端、插件系统）
- 全局通知（如用户登出、主题切换广播）

---

#### 一、什么是 EventEmitter？

`EventEmitter` 是一个经典的事件管理器，提供：

- `on(event, callback)`：订阅事件
- `emit(event, data)`：发布事件
- `off(event, callback)`：取消订阅

它类似于浏览器的 `addEventListener` / `dispatchEvent`，但用于应用层逻辑事件。

---

#### 二、手写一个简易 EventEmitter

```js
// utils/EventEmitter.js
class EventEmitter {
  constructor() {
    this.events = {}
  }

  // 订阅事件
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // 发布事件
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  // 取消订阅
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  // 取消所有订阅（可选）
  removeAllListeners(event) {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }
}

// 导出单例
export default new EventEmitter()
```

> 使用单例模式确保全局唯一事件中心。

---

### 在 React 组件中使用

1. 发布事件（组件 A）

```jsx
const handleClick = () => {
  // 发布自定义事件，携带数据
  emitter.emit('message-sent', {
    text: '你好！',
    time: new Date().toLocaleTimeString()
  })
  setInput('') // 清空输入
}
```

2. 订阅事件（组件 B）

```jsx
const [messages, setMessages] = useState('')

useEffect(() => {
  // 定义事件处理函数
  const handleMessage = data => {
    setMessages(data)
  }

  // 订阅事件
  emitter.on('message-sent', handleMessage)

  // 组件卸载时取消订阅，防止内存泄漏
  return () => {
    emitter.off('message-sent', handleMessage)
  }
}, [])
```

React 中通过自定义 EventEmitter 实现的跨组件通信机制，本质上和 Vue 2 中使用的 “Event Bus（事件总线）” 非常相似，甚至可以说是同一设计模式在不同框架下的具体实现。

下面我们从多个维度进行对比，帮助你清晰理解它们的异同：

---

### 相同点：核心思想完全一致

| 特性         | Vue Event Bus                                              | React 自定义 EventEmitter                                        |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| **设计模式** | 发布-订阅（Pub/Sub）                                       | 发布-订阅（Pub/Sub）                                             |
| **通信方式** | 跨组件、解耦、无需父子关系                                 | 跨组件、解耦、任意位置                                           |
| **实现形式** | 一个空的 Vue 实例作为事件中心                              | 一个单例的 EventEmitter 类实例                                   |
| **API 风格** | `bus.$emit('event', data)`<br>`bus.$on('event', callback)` | `emitter.emit('event', data)`<br>`emitter.on('event', callback)` |
| **适用场景** | 全局通知、非父子通信、与非 Vue 模块集成                    | 同左                                                             |

#### Vue 2 Event Bus 示例（经典写法）：

```js
// eventBus.js
import Vue from 'vue'
export const EventBus = new Vue()
```

```js
// ComponentA.vue
EventBus.$emit('user-logged-in', { id: 123 })

// ComponentB.vue
EventBus.$on('user-logged-in', user => {
  console.log('欢迎:', user)
})
```

### React EventEmitter 示例（前文已展示）：

```js
// emitter.js
export default new EventEmitter()

// ComponentA.jsx
emitter.emit('user-logged-in', { id: 123 })

// ComponentB.jsx
useEffect(() => {
  const handler = user => console.log('欢迎:', user)
  emitter.on('user-logged-in', handler)
  return () => emitter.off('user-logged-in', handler) // 清理！
}, [])
```

**两者在逻辑结构、使用方式、目的上几乎一模一样**。

---

### 不同点：框架生态与最佳实践差异

| 方面             | Vue (Event Bus)                                                                                                        | React (EventEmitter)                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **官方态度**     | Vue 2 社区广泛使用，但**Vue 官方从未正式推荐**；Vue 3 已移除 `$on`/`$emit` 实例方法，**Event Bus 在 Vue 3 中不再可行** | React **从未提供内置事件总线**，社区也不推荐用于常规状态管理               |
| **替代方案**     | Vue 3 推荐使用 **`provide/inject` + `reactive`** 或 **Pinia/Vuex**                                                     | React 推荐使用 **Context + useReducer**、**状态提升** 或 **Zustand/Redux** |
| **内存泄漏风险** | 高（忘记 `$off` 会导致回调残留）                                                                                       | 同样高（忘记 `off` 或未在 `useEffect` 中清理）                             |
| **类型支持**     | Vue 2 中弱类型；Vue 3 + TS 可封装强类型 Bus                                                                            | 可通过 TypeScript 定义事件名和载荷类型，实现强类型安全                     |
| **调试难度**     | 事件流难以追踪（“谁发的？谁收的？”）                                                                                   | 同样难以追踪，破坏 React 的数据流可预测性                                  |

---

### 合理使用场景（仍然有价值，比如小程序订阅 APP 事件）

mitt 是一个轻量级、框架无关的事件发布-订阅（Pub/Sub）库，完全可以在 Vue、React、原生 JavaScript 甚至 Node.js 中使用。

基本用法：

```js
import mitt from 'mitt'

const emitter = mitt()

// 监听事件
emitter.on('login', user => {
  console.log('用户登录:', user)
})

// 触发事件
emitter.emit('login', { id: 123, name: 'Alice' })

// 取消监听
emitter.off('login')
```

这段代码在 React、Vue 中都能直接运行！
