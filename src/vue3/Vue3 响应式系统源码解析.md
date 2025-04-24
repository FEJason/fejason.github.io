# Vue3 响应式系统核心源码解析

Vue3 的响应式系统是其核心特性之一，相比 Vue2 有了重大改进，主要基于 ES6 的 Proxy 实现。

## 响应式实现原理

Vue3 使用 ES6 的 Proxy 替代了 Vue2 中的 Object.defineProperty，这带来了以下优势：

1. 可以检测到属性的添加和删除
2. 可以拦截数组的变化
3. 性能更好

## 核心模块

Vue3 的响应式系统主要包含以下几个核心部分：

1. reactive() - 创建响应式对象
2. ref() - 创建响应式基本类型值
3. effect() - 副作用函数，用于依赖收集和触发更新
4. track() - 依赖收集
5. trigger() - 触发更新

## 源码结构

响应式系统的源码主要在 packages/reactivity 包中：

https://github.com/vuejs/core/tree/main/packages/reactivity/src

```
packages/reactivity/
├── src/
│   ├── baseHandlers.ts    // Proxy 处理器
│   ├── collectionHandlers.ts // 集合类型的处理器
│   ├── computed.ts        // 计算属性
│   ├── effect.ts          // 副作用系统
│   ├── operations.ts      // 定义 Track/Trigger 操作类型
│   ├── reactive.ts        // reactive 相关实现
│   └── ref.ts            // ref 相关实现
```

## 核心实现原理解析

```js
// 定义一个全局变量，用于存储当前活动的副作用函数
let activeEffect = null

// 创建一个 WeakMap，用于存储响应式对象和其依赖关系的映射
// key 是响应式对象，value 是一个 Map，存储每个属性对应的副作用函数集合
const targetMap = new WeakMap()

/**
 * 创建响应式对象
 * @param {Object} target - 要被代理的目标对象
 * @returns {Proxy} 返回一个代理对象
 */
function reactive(target) {
  // 使用 Proxy 对目标对象进行拦截
  return new Proxy(target, {
    // 拦截读取操作
    get(obj, key, receiver) {
      // 使用 Reflect.get 获取目标对象的属性值
      const result = Reflect.get(obj, key, receiver)
      // 调用 track 函数进行依赖收集
      track(obj, key) // 收集依赖
      return result // 返回属性值
    },
    // 拦截写入操作
    set(obj, key, value, receiver) {
      // 使用 Reflect.get 获取旧值
      const oldValue = obj[key]
      // 使用 Reflect.set 设置新值
      const result = Reflect.set(obj, key, value, receiver)
      // 如果新值与旧值不同，则触发更新
      if (oldValue !== value) {
        trigger(obj, key) // 触发更新
      }
      return result // 返回设置结果
    }
  })
}

/**
 * 依赖收集
 * @param {Object} target - 响应式对象
 * @param {string} key - 属性名
 */
function track(target, key) {
  // 如果没有激活的副作用函数，则直接返回
  if (!activeEffect) return

  // 从 targetMap 中获取当前响应式对象的依赖映射表
  let depsMap = targetMap.get(target)
  // 如果不存在依赖映射表，则创建一个新的 Map 并存储到 targetMap 中
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 从依赖映射表中获取当前属性的依赖集合
  let dep = depsMap.get(key)
  // 如果不存在依赖集合，则创建一个新的 Set 并存储到依赖映射表中
  if (!dep) {
    dep = new Set() // 使用 Set 存储副作用函数，避免重复
    depsMap.set(key, dep)
  }

  // 将当前的副作用函数加入依赖集合
  dep.add(activeEffect)
}

/**
 * 触发更新
 * @param {Object} target - 响应式对象
 * @param {string} key - 属性名
 */
function trigger(target, key) {
  // 从 targetMap 中获取当前响应式对象的依赖映射表
  const depsMap = targetMap.get(target)
  // 如果不存在依赖映射表，则直接返回
  if (!depsMap) return

  // 从依赖映射表中获取当前属性的依赖集合
  const dep = depsMap.get(key)
  // 如果存在依赖集合，则遍历并执行所有相关的副作用函数
  if (dep) {
    dep.forEach(effectFn => effectFn()) // 执行副作用函数
  }
}

/**
 * 注册副作用函数
 * @param {Function} fn - 副作用函数
 */
function effect(fn) {
  // 定义一个包装函数，用于清理旧依赖并执行用户传入的副作用函数
  const effectFn = () => {
    cleanup(effectFn) // 清理旧的依赖
    activeEffect = effectFn // 设置当前激活的副作用函数
    fn() // 执行用户传入的副作用函数
    activeEffect = null // 清空当前激活的副作用函数
  }
  effectFn.deps = [] // 用于存储该副作用函数关联的所有依赖集合
  effectFn() // 立即执行一次副作用函数
}

/**
 * 清理副作用函数的旧依赖
 * @param {Function} effectFn - 副作用函数
 */
function cleanup(effectFn) {
  // 遍历该副作用函数关联的所有依赖集合
  for (const dep of effectFn.deps) {
    dep.delete(effectFn) // 从依赖集合中移除该副作用函数
  }
  effectFn.deps.length = 0 // 清空依赖数组
}
```

示例代码：

```js
// 创建一个响应式对象
const state = reactive({
  count: 0 // 初始化一个响应式属性 count
})

// 注册一个副作用函数
effect(() => {
  console.log('count:', state.count) // 当 state.count 变化时，自动重新执行
})

// 修改响应式数据，触发更新
state.count++ // 输出 "count: 1"
state.count++ // 输出 "count: 2"
```

## 响应式系统工作流程

### 1. 初始化阶段：

- 通过 reactive() 或 ref() 创建响应式对象
- 使用 Proxy 代理目标对象

### 2. 依赖收集阶段：

- 当执行 effect() 时，内部的函数会被立即执行
- 访问响应式属性时触发 get 拦截器
- track() 将当前 activeEffect（当前活动的副作用函数） 与属性建立关联

### 3. 触发更新阶段：

- 修改响应式属性时触发 set 拦截器
- trigger() 查找依赖该属性的所有 effect 并执行

## 性能优化

Vue3 响应式系统相比 Vue2 有以下优化：

### 1. 惰性响应：只有被访问的属性才会被代理，而不是递归代理整个对象

### 2. 更精确的依赖收集：基于 Proxy 可以精确追踪属性访问

### 3. 更好的集合类型支持：通过单独的集合类型的处理器处理 Map/Set 等集合类型

### 4. 编译时优化：配合模板编译时的静态分析，减少运行时开销

## 与 Vue2 的对比

### 1. 实现方式：

- Vue2 使用 Object.defineProperty 递归遍历对象所有属性，为每个属性添加 getter/setter，对于数组需要特殊处理（重写数组方法）

- Vue3 使用 Proxy

### 2. 数组处理：

- Vue2 需要重写数组方法

- Vue3 直接支持数组索引修改和 length 变化

### 3. 新增属性：

- Vue2 需要使用 Vue.set

- Vue3 直接支持新属性响应

### 4. 性能：

Vue3 的响应式初始化更快，内存占用更少

- 初始化时不需要递归遍历所有属性
- 动态添加属性也能自动响应
- 数组操作不需要特殊处理

通过这种基于 Proxy 的响应式系统，Vue3 实现了更强大、更高效的响应式能力，为组件更新和计算属性等特性提供了坚实的基础。
