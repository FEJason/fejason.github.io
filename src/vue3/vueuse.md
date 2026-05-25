# VueUse 可复用的响应式逻辑标准库

> 适用对象：Vue3 开发者（熟悉 Composition API）
> 前提：项目已安装 `vue@^3.0` 和 `@vueuse/core`
> 目标：减少重复代码、提升可维护性、优化性能

---

## 一、VueUse 是什么

VueUse 是一个基于 Vue 3 Composition API 构建的 实用工具函数集合库，旨在帮助开发者更高效、简洁地处理常见的前端逻辑（如响应式状态、浏览器 API、传感器、动画、网络请求等）。

由 Vue/Vite/Nuxt 核心团队成员 Anthony Fu 主导开发，被 Vue 官方文档和 Nuxt 官方推荐。

> 一套“可复用的响应式逻辑标准库”

它主要解决的是项目中反复出现的通用逻辑问题：

| 常见问题              | VueUse 解决方案                   |
| ----------------- | ----------------------------- |
| 手动绑定/解绑事件         | useEventListener 自动清理         |
| localStorage 同步繁琐 | useLocalStorage 响应式           |
| 防抖节流重复实现          | useDebounceFn / useThrottleFn |
| 异步状态管理混乱          | useAsyncState / useFetch      |
| 设备能力判断复杂          | useNetwork / useDark          |

---

## 二、为什么项目中应该使用 VueUse？

### 2.1 不使用 VueUse 的典型问题

```js
const scrollTop = ref(0)

window.addEventListener('scroll', () => {
  scrollTop.value = window.scrollY
})
```

存在问题：

* 没有解绑，可能导致内存泄漏
* 逻辑分散，不利于复用
* 可读性差

---

### 2.2 使用 VueUse 的写法

```js
const { y: scrollTop } = useScroll(window)
```

优势：

* 自动清理事件
* 响应式数据
* 代码更简洁

---

## 三、核心 API + 项目实战案例

---

### 3.1 本地存储

| API                               | 用途                 | 示例                                                |
| --------------------------------- | ------------------ | ------------------------------------------------- |
| `useLocalStorage(key, init)`      | 响应式 localStorage   | `const theme = useLocalStorage('theme', 'light')` |
| `useSessionStorage(key, init)`    | 响应式 sessionStorage | 同上                                                |
| `useStorage(key, init, storage?)` | 自定义存储（如 IndexedDB） | 支持自定义 storage                                     |

> 自动处理 JSON 序列化/反序列化，支持复杂对象！

---

#### useLocalStorage

#### 场景 1：用户登录态持久化

```js
const userInfo = useLocalStorage('userInfo', {})
```

实际项目应用：

```js
// 登录后
userInfo.value = res.data

// 页面刷新后自动恢复
console.log(userInfo.value.token)
```

优化点：

* 不需要手动 JSON.parse / stringify
* 数据天然响应式

---

#### 场景 2：深色模式切换

```js
const isDark = useDark()
const toggleDark = useToggle(isDark)

// 模板中：<button @click="toggleDark()">切换主题</button>
```

---

### 3.2 实用工具（防抖与节流）

| API                        | 用途                                    |
| -------------------------- | ------------------------------------- |
| `useDebounceFn(fn, delay)` | 防抖：操作后在指定的时间内没有再操作，这一次才被判定有效。（常用于搜索框） |
| `useThrottleFn(fn, delay)` | 节流：规定时间内，只触发一次。（常用于抢购按钮/滚动/resize）    |
| `useRafFn(fn)`             | 基于 requestAnimationFrame 的动画循环        |
| `computedAsync()`          | 异步 computed（实验性）                      |

---

#### useDebounceFn

防抖：操作后在指定的时间内没有再操作，这一次才被判定有效。（常用于搜索框）

#### 场景：搜索接口优化

```js
const keyword = ref('')

const fetchList = async () => {
  await getList({ keyword: keyword.value })
}

const debounceSearch = useDebounceFn(fetchList, 800)
```

```html
<input v-model="keyword" @input="debounceSearch" />
```

---

效果：

* 请求次数大幅减少
* 用户体验更平滑

---

#### useThrottleFn

节流：规定时间内，只触发一次。（常用于抢购按钮/滚动/resize）

#### 场景：防重复提交（订单/支付）

```js
const submit = useThrottleFn(createOrder, 2000)
```

适用：

* 提交按钮
* 高频点击操作

---

### 3.3 网络请求管理

---

#### useFetch

#### 场景：简单请求

```js
const { data, loading, error } = useFetch('/api/user').get().json()
```

---

#### 实战建议

| 场景              | 推荐方案     |
| --------------- | -------- |
| 简单请求            | useFetch |
| 复杂业务（token、拦截器） | axios    |

---

#### 封装统一请求（推荐）

```js
export function useApi(url) {
  const { data, error, execute } = useFetch(url).get().json()

  return {
    data,
    error,
    run: execute
  }
}
```

---

### 3.4 滚动与视图监听

---

#### useScroll

##### 场景：分页加载

```js
const { y } = useScroll(window)

watch(y, (val) => {
  if (val > 1000) {
    loadMore()
  }
})
```

---

##### 场景：返回顶部按钮

```js
const showBackTop = computed(() => y.value > 300)
```

---

#### useIntersectionObserver

##### 场景：懒加载 / 无限滚动

```js
useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) loadMore()
  }
)
```

优势：

* 性能优于 scroll 监听
* 更精准触发

---

### 3.5 事件监听

---

#### useEventListener

##### 场景：ESC 关闭弹窗

```js
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})
```

优势：

* 自动解绑
* 避免内存泄漏

---

### 3.6 窗口与设备信息 & DOM 操作

| API                                        | 用途                           |
| ------------------------------------------ | ---------------------------- |
| `useMouse()`                               | 鼠标坐标（x, y）                   |
| `useScroll(element?)`                      | 滚动位置（x, y, isScrolling）      |
| `useWindowSize()`                          | 窗口尺寸（width, height）          |
| `useEventListener(target, event, handler)` | 自动清理的事件监听                    |
| `useFocus(element)`                        | 元素聚焦状态（focused, focus, blur） |

---

#### useWindowSize

##### 场景：响应式布局判断

```js
const { width } = useWindowSize()

const isMobile = computed(() => width.value < 768)
```

---

#### useNetwork

##### 场景：断网提示

```js
const { isOnline } = useNetwork()

watch(isOnline, (val) => {
  if (!val) showToast('网络已断开')
})
```

---

#### useEventListener

##### 路由离开确认

```js
export function useConfirmLeave(fn) {
  useEventListener('beforeunload', (e) => {
    if (fn()) {
      e.preventDefault()
    }
  })
}
```

### 3.7 定时器管理

---

#### useIntervalFn

```js
const { pause, resume } = useIntervalFn(() => {
  refreshData()
}, 5000)
```

---

##### 场景：订单状态轮询

```js
useIntervalFn(() => {
  getOrderStatus(orderId)
}, 3000)
```

优势：

* 自动清理
* 避免重复创建定时器

---

### 3.8 状态增强

---

#### useToggle

```js
const [visible, toggle] = useToggle(false)
```

---

##### 场景：弹窗控制

```html
<button @click="toggle()">打开弹窗</button>
```

---

#### useVModel

##### 场景：组件封装

```js
const value = useVModel(props, 'modelValue', emit)
```

优势：

* 简化 v-model 实现
* 提高组件复用性

---

### 3.9 滚动性能优化

```js
const handleScroll = useThrottleFn(() => {
  // 滚动逻辑
}, 200)
```

---

## 四、最佳实践

---

### 4.1 优先使用 VueUse 替代原生实现

| 原生实现             | VueUse           |
| ---------------- | ---------------- |
| addEventListener | useEventListener |
| setInterval      | useIntervalFn    |
| localStorage     | useLocalStorage  |
| debounce(防抖)     | useDebounceFn    |

---

### 4.2 避免滥用

不建议：

* 所有逻辑都用 VueUse

建议：

* 通用逻辑使用 VueUse
* 业务逻辑自行封装

---

## 六、一句话总结

VueUse 是 Vue3 项目的“标准工具层”，核心价值在于：

* 统一代码风格
* 提升稳定性
* 降低维护成本

---

## 七、落地建议

1. 替换项目中的通用逻辑：

   * debounce
   * localStorage
   * eventListener

2. 建立统一目录：

```
/composables/
```

例如：

```js
useUser()
useRequest()
useAuth()
```

> **VueUse 不是魔法，而是最佳实践的沉淀。善用它，让你的代码更简洁、更可靠！**
