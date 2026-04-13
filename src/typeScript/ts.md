# TypeScript 项目开发常用类型定义与语法指南

> 本文档旨在统一团队对 TypeScript 类型系统的理解，规范类型写法，提升代码可读性与健壮性。

---

## 1. 基础类型（Primitive Types）

```ts
let isLoading: boolean = false // 布尔值
let count: number = 42 // 数字（整数/浮点）
let name: string = 'Alice' // 字符串
let id: bigint = 100n // 大整数（ES2020+）
let symbolId: symbol = Symbol('id') // 唯一标识符
let nothing: null = null // null 类型
let undef: undefined = undefined // undefined 类型
let empty: void = undefined // 表示无返回值（常用于函数）
```

> `null` 和 `undefined` 是独立类型，在 `strictNullChecks: true` 下不能赋值给其他类型。

---

## 2. 接口（Interface）—— 定义对象结构

```ts
// interface 声明接口：用于描述对象“形状”
export interface User {
  id: number // 必需属性
  name: string
  email?: string // ? 表示可选属性（optional）
  readonly createdAt: Date // readonly 表示只读，不可修改
}
```

> **适用场景**：API 响应、配置对象、组件 props 等结构化数据。

---

## 3. 类型别名（Type Alias）—— 更灵活的类型组合

```ts
// type 可定义原始类型、联合、元组、函数等任意类型
export type ID = string | number // 联合类型：ID 可以是字符串或数字

export type Status = 'idle' | 'loading' | 'success' | 'error' // 字符串字面量联合

export type Point = [number, number] // 元组类型（固定长度和类型的数组）

export type Callback = (data: unknown) => void // 函数类型别名
```

> **interface vs type**：
>
> - `interface` 可合并（declaration merging），适合公开 API；
> - `type` 更灵活，适合内部复杂类型组合。

---

## 4. 联合类型（Union Types）与字面量类型（Literal Types）

```ts
// 字符串字面量联合：限制取值范围
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// 数字字面量
type StatusCode = 200 | 404 | 500

// 联合类型：变量可为多种类型之一
let padding: string | number = '10px'
padding = 10 // OK
```

> 用于枚举式状态、配置选项、错误码等。

---

## 5. 交叉类型（Intersection Types）—— 合并多个类型

```ts
interface HasName {
  name: string
}
interface HasAge {
  age: number
}

// & 表示同时满足两个接口
type Person = HasName & HasAge

const p: Person = { name: 'Bob', age: 30 } // ✅
```

> 常用于 mixins、高阶组件、组合配置等场景。

---

## 6. 内置工具类型（Utility Types）

### `Record<K, V>`

```ts
// 构造一个对象类型，键为 K，值为 V
type Headers = Record<string, string>
// 等价于 { [key: string]: string }
```

### `Partial<T>` —— 所有属性变为可选

```ts
interface Config {
  host: string
  port: number
}
type PartialConfig = Partial<Config> // { host?: string; port?: number; }
```

### `Required<T>` —— 所有属性变为必填

```ts
type FullConfig = Required<PartialConfig> // 恢复为原接口
```

### `Pick<T, K>` / `Omit<T, K>` —— 选择或排除属性

```ts
type BasicUser = Pick<User, 'id' | 'name'>
type PublicUser = Omit<User, 'email'> // 隐藏敏感字段
```

### `Readonly<T>` —— 所有属性只读

```ts
const config: Readonly<Config> = { host: 'localhost', port: 3000 }
// config.host = 'xxx'; // ❌ 编译错误
```

> 工具类型极大减少重复代码，提升类型复用性。

---

## 7. 数组与元组（Array & Tuple）

```ts
// 数组类型
let tags: string[] = ['ts', 'react']
// 或
let scores: Array<number> = [90, 85]

// 元组：固定长度 + 固定类型顺序
let position: [number, number] = [10, 20]
let httpRes: [number, string] = [200, 'OK']
```

---

## 8. 函数类型（Function Types）

```ts
// 函数参数与返回值类型注解
function fetchUser(id: number): Promise<User> {
  return Promise.resolve({ id, name: 'User' })
}

// 函数类型别名
type EventHandler = (event: Event) => void

// 可选参数与默认参数
function log(message: string, level?: 'info' | 'error') {
  /* ... */
}
function greet(name: string = 'Guest') {
  /* ... */
}
```

> 所有函数都应明确参数和返回类型（除非能被推导且非常简单）。

---

## 9. 泛型（Generics）—— 编写可复用、类型安全的逻辑

```ts
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 泛型接口
interface ResponseData<T> {
  code: number
  data: T
  message?: string
}

// 使用
type UserResponse = ResponseData<User>
```

> 广泛用于工具函数、API 封装、状态管理等。

---

## 10. unknown 与 any —— 类型安全的关键区别

```ts
let val: any = 'hello'
val.toFixed() // ❌ 运行时报错，但 TS 不检查！

let safeVal: unknown = 'hello'
// safeVal.toUpperCase(); // ❌ TS 报错：unknown 不能直接调用方法
if (typeof safeVal === 'string') {
  safeVal.toUpperCase() // ✅ 类型守卫后可用
}
```

> **原则**：优先使用 `unknown` 替代 `any`，确保类型安全。

---

## 11. 类型守卫（Type Guards）—— 缩小类型范围

```ts
// typeof 守卫
function isString(x: unknown): x is string {
  return typeof x === 'string'
}

// in 守卫（用于区分接口）
interface Bird {
  fly(): void
}
interface Fish {
  swim(): void
}
function move(animal: Bird | Fish) {
  if ('fly' in animal) animal.fly()
  else animal.swim()
}
```

> 在处理联合类型或 `unknown` 时必不可少。

---

## 12. 模块导出（Export）—— 组织类型可见性

```ts
export interface Config {
  /* ... */
} // 导出接口
export type Status = 'ok' | 'fail' // 导出类型别名
export { User as UserInfo } // 重命名导出
```

> 所有公共类型都应显式 `export`，便于外部引用。

---

## 13. 索引签名（Index Signatures）—— 动态键对象

```ts
// 允许任意 string 键，值为 number
interface NumericMap {
  [key: string]: number
}

// 与 Record 等价
type NumericMap2 = Record<string, number>
```

> ⚠️ 尽量优先使用 `Record`，语义更清晰。

---

## 14. 映射类型（Mapped Types）—— 高级类型操作（进阶）

```ts
// 将所有属性变为可选
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}

// 将所有属性变为只读
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

> 内置工具类型如 `Partial`、`Readonly` 就是这样实现的。

---

## 最佳实践建议

| 场景               | 推荐做法                               |
| ------------------ | -------------------------------------- |
| 定义对象结构       | 优先用 `interface`（支持合并）         |
| 联合/元组/函数类型 | 用 `type`                              |
| 配置对象           | 使用可选属性 + `Partial` 初始化        |
| API 响应           | 使用泛型 `ResponseData<T>` 包装        |
| 用户输入/外部数据  | 先用 `unknown`，再通过校验转为具体类型 |
| 避免               | 尽量不用 `any`，禁用 `implicitAny`     |

---

> **配置建议**：在 `tsconfig.json` 中开启严格模式：
>
> ```json
> {
>   "compilerOptions": {
>     "strict": true,
>     "noImplicitAny": true,
>     "strictNullChecks": true,
>     "exactOptionalPropertyTypes": true
>   }
> }
> ```

---

这份文档可作为团队 TypeScript 开发规范的一部分，帮助新人快速上手，也促进代码一致性。欢迎根据项目实际情况裁剪或补充！
