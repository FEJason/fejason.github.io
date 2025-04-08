# TypeScript 类型定义

### 哪些地方必须定义类型？
1. 函数的参数 & 返回值：
- 函数参数：如果不定义类型，调用时容易传递错误的值。
- 返回值类型：避免意外的 undefined 或错误类型。

```ts
// ✅ 明确参数和返回值类型
function sum(a: number, b: number): number {
  return a + b
}

// ❌ 错误示例（返回值未声明，可能会误返回 `undefined`）
function badSum(a: number, b: number) {
  if (a > 0) return a + b // 如果 a <= 0，函数会隐式返回 undefined
}

// 修改后，确保返回值始终是 number
function sum(a: number, b: number): number {
  if (a > 0) {
    return a + b
  }
  return 0
}

```

2. API 数据 & 接口 (interface)
- 后端返回的数据：明确结构，避免 any 类型导致 TS 失效。
- 接口字段类型：避免字段缺失或格式错误。

```ts
// 这里和 Dart 非常相似
interface User {
  id: number
  name: string
  email?: string // 可选字段
}

function getUser(): User {
  return { id: 1, name: 'Alice' }
}
```

3. 复杂对象 & 枚举
- 对象结构复杂时，使用 interface 或 type 。
- 有固定值的场景，如状态枚举。

```ts
// 定义产品类型
interface Product {
  id: number;
  name: string;
  price: number;
}

// 定义订单状态枚举
enum OrderStatus {
  Pending = 'pending',
  Shipped = 'shipped',
  Delivered = 'delivered'
}

// 示例订单对象
const order = {
  id: 101,
  productId: 1, // 假设这是产品ID
  status: OrderStatus.Pending
};

// 获取订单详情函数
function getOrderDetails(orderId: number): { id: number; product: Product; status: OrderStatus } {
  // 这里应包含获取订单详情的实际逻辑
  // ...

  return {
    id: orderId,
    product: { id: 1, name: 'Laptop', price: 999.99 },
    status: OrderStatus.Pending
  };
}
```

4. 事件处理 & 回调
- 事件对象，防止 TS 推导错误。
- 回调参数，避免不必要的 any。
- void 类型，表示函数没有返回值

```ts
// ✅ 正确的事件处理类型
const handleClick = (event: MouseEvent): void => {
  console.log(event.clientX, event.clientY)
}

document.addEventListener('click', handleClick)
```

5. 泛型 (Generics)
- 复用性高的函数或类。
- 确保泛型不变成 any。

- 泛型（Generics）是 TypeScript 中一种强大的工具，它允许你编写可以处理多种类型的代码，同时仍然保持类型安全。通过使用泛型，你可以创建可复用的组件，这些组件不仅能支持当前的数据类型，还能在未来支持更多的数据类型，而无需重写代码。

泛型的基本概念
- 泛型：允许你在定义函数、接口或类时，不预先指定具体的类型，而是将类型作为参数传递进去。这样可以在不失去类型信息的情况下编写灵活且可复用的代码。
- 目的：提高代码的复用性，同时确保类型安全，避免使用 any 类型带来的潜在问题。

下面是一个使用泛型的例子，展示了如何定义一个可以处理任何类型数组并返回第一个元素的函数：
```ts
// 使用泛型确保类型安全
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

const numbers = [1, 2, 3]
const firstNumber = getFirst(numbers) // TypeScript 知道它是 number

console.log(firstNumber) // 输出: 1

const strings = ["apple", "banana", "cherry"]
const firstString = getFirst(strings) // TypeScript 知道它是 string

console.log(firstString) // 输出: "apple"
```

6. any、unknown 和 as 的正确使用
- 避免 any，优先使用 unknown 或显式类型。
- 类型断言 (as) 仅在必要时使用，并确保正确。

在 TypeScript 中，处理不确定类型的数据时，了解如何正确使用 any、unknown 以及类型断言 (as) 非常重要。合理地使用这些工具可以提高代码的安全性和可维护性。

#### any 类型
- 定义：any 类型表示任何类型的值。这意味着你可以在不进行任何类型检查的情况下对变量执行任何操作。
- 缺点：使用 any 会绕过 TypeScript 的类型检查系统，这可能导致潜在的运行时错误。因此，应尽量避免使用 any。
```ts
let value: any = "Hello, world!"
value() // 不会报错，但在运行时会抛出错误
```

#### unknown 类型
- 定义：unknown 类型表示未知类型的值。与 any 不同的是，unknown 类型的值在没有进行类型检查或类型断言之前，不能直接操作。
- 优点：unknown 提供了更高的安全性，因为它强制你在使用该值之前进行类型检查或类型断言。
```ts
let value: unknown = "Hello, world!";
// value(); // 错误：Type 'unknown' is not callable

if (typeof value === "string") {
  console.log(value.toUpperCase()); // 安全：现在我们知道 value 是字符串
}
```

#### 类型断言 (as)
定义：类型断言（也称为类型转换）允许你告诉编译器某个值的类型。它通常用于将一个类型更具体化，以便在特定上下文中使用。

注意事项：
- 类型断言只能在你非常确定类型的情况下使用。
- 过度使用类型断言可能会导致运行时错误，因为 TypeScript 不会在编译时验证断言的准确性。
```ts
let value: unknown = '{"name": "Bob"}';

// 使用类型断言将 JSON 字符串解析为对象
const result = JSON.parse(value as string) as { name: string };

console.log(result.name); // 正确：TypeScript 现在知道它有 name 属性
```
#### 最佳实践
- 避免使用 any：尽可能使用更具体的类型，或者在无法确定类型时使用 unknown。
- 优先使用 unknown：当你不确定数据的类型时，使用 unknown 而不是 any。这样可以确保在使用数据之前进行必要的类型检查或断言。
- 谨慎使用类型断言 (as)：只有在你非常确定类型的情况下才使用类型断言，并且尽量减少其使用频率。过度使用类型断言可能会引入运行时错误。
- 类型检查和断言结合使用：在某些情况下，结合类型检查和类型断言可以提供更强的安全性。
```ts
let value: unknown = '{"name": "Bob"}';

if (typeof value === "string") {
  const parsedValue = JSON.parse(value) as { name: string };
  console.log(parsedValue.name); // 安全：我们已经检查并断言了类型
}
```

### 哪些地方可以不写类型？
1. 变量的类型推导
```ts
// TypeScript 能自动推导 number 类型
const count = 10 // 不需要写 `: number`
```

2. 简单的箭头函数
```ts
// TypeScript 可以推导出 x 是 number，返回值也是 number
const square = (x: number) => x * x
```

### 结论
哪些地方 必须 定义类型？
- 函数的参数 & 返回值
- API 响应数据 & 接口
- 复杂对象 & 枚举
- 事件处理 & 回调
- 泛型 & 动态数据
- 避免 any，用 unknown 或 as 进行安全断言

哪些地方 可以 省略类型？
- 变量的类型推导（TypeScript 自动推导）
- 简单的箭头函数（TS 能推导参数和返回值）

这样做可以提高代码可读性，避免不必要的类型冗余，同时确保类型安全！