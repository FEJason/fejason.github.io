## 再探事件循环

事件循环(Event Loop)是 JavaScript 处理异步操作的机制，它使得 JavaScript 能够在单线程上执行异步操作。

事件循环的机制是基于消息队列的。当 JavaScript 执行异步操作时，比如发起一个网络请求或设置一个定时器，这些操作不会阻塞主线程，而是被放入消息队列中。一旦主线程的任务执行完成，事件循环就会从消息队列中取出一个任务，将其加入到主线程的任务队列中执行。

### 宏任务 (Macrotask)

- 包括：script 整体代码块、setTimeout、setInterval、I/O 操作等。
- 每次事件循环只会从宏任务队列中取出一个宏任务来执行。

> 在计算机科学中，I/O 操作指的是输入（Input）和输出（Output）操作。这些操作是计算机与外部世界交互的方式，包括接收用户输入、向显示器输出信息、读取文件或写入数据到磁盘等。简单来说，任何涉及数据进出计算机系统的操作都可以被认为是 I/O 操作。

### 微任务 (Microtask)

- 包括：Promise.then/catch/finally、MutationObserver 等。
- 在当前宏任务执行完毕后，会立即检查并清空所有微任务队列中的任务（即执行所有微任务）。

事件循环的执行顺序：

- 执行全局代码（第一个宏任务），遇到同步任务直接执行，遇到异步任务（微任务、宏任务），加入到任务队列。
- 当前宏任务执行完毕，执行所有微任务。
- 执行下一个宏任务，重复上述过程。

示例代码

```js
console.log('A') // 同步代码

setTimeout(() => {
  console.log('B') // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('C') // 微任务
})

setTimeout(() => {
  console.log('D') // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('E') // 微任务
})
```

输出结果：

```
A
C
E
B
D
```

执行流程解析

初始状态

- 宏任务队列：[script]
- 微任务队列：[]

第一步：执行全局代码（第一个宏任务）

- console.log('A') 输出 A。
- 遇到第一个 setTimeout，将其回调函数加入宏任务队列：[setTimeout B]。
- 遇到第一个 Promise.resolve().then()，将其回调函数加入微任务队列：[Promise C]。
- 遇到第二个 setTimeout，将其回调函数加入宏任务队列：[setTimeout B, setTimeout D]。
- 遇到第二个 Promise.resolve().then()，将其回调函数加入微任务队列：[Promise C, Promise E]。

此时：

- 宏任务队列：[setTimeout B, setTimeout D]
- 微任务队列：[Promise C, Promise E]

第二步：执行微任务队列

- 当前宏任务（script）执行完毕后，清空微任务队列：
  - 执行 Promise C 回调，输出 C。
  - 执行 Promise E 回调，输出 E。

此时：

- 宏任务队列：[setTimeout B, setTimeout D]
- 微任务队列：[]

第三步：执行下一个宏任务

- 从宏任务队列中取出第一个 setTimeout B 并执行，输出 B。

此时：

- 宏任务队列：[setTimeout D]
- 微任务队列：[]

第四步：执行下一个宏任务

- 从宏任务队列中取出 setTimeout D 并执行，输出 D。

更复杂的例子：

```js
console.log('同步代码 1')

setTimeout(() => {
  console.log('宏任务 1')
  Promise.resolve().then(() => {
    console.log('微任务 3')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('微任务 1')
  setTimeout(() => {
    console.log('宏任务 2')
  }, 0)
})

Promise.resolve().then(() => {
  console.log('微任务 2')
})

console.log('同步代码 2')
```

输出结果：

```
同步代码 1
同步代码 2
微任务 1
微任务 2
宏任务 1
微任务 3
宏任务 2
```

执行流程解析

初始状态

- 宏任务队列：[script]
- 微任务队列：[]

第一步：执行全局代码（第一个宏任务）

- 执行同步代码，输出 "同步代码 1"。
- 遇到 setTimeout，将其回调函数加入宏任务队列：
  - 宏任务队列：[宏任务 1]
- 遇到第一个 Promise.resolve().then()，将其回调函数加入微任务队列：
  - 微任务队列：[微任务 1]
- 遇到第二个 Promise.resolve().then()，将其回调函数加入微任务队列：
  - 微任务队列：[微任务 1, 微任务 2]
- 执行同步代码，输出 "同步代码 2"。

此时的状态：

- 宏任务队列：[宏任务 1]
- 微任务队列：[微任务 1, 微任务 2]

第二步：清空微任务队列

- 当前宏任务（script）执行完毕后，清空微任务队列：
  - 执行 微任务 1 回调，输出 微任务 1。
  - 在 微任务 1 中遇到嵌套的 setTimeout，将其回调函数加入宏任务队列：
    - 宏任务队列：[宏任务 1, 宏任务 2]
  - 执行 微任务 2 回调，输出 微任务 2。

此时的状态：

- 宏任务队列：[宏任务 1, 宏任务 2]
- 微任务队列：[]

第三步：执行下一个宏任务

从宏任务队列中取出第一个 宏任务 1 并执行

- 输出 "宏任务 1"。
- 遇到嵌套的 Promise.resolve().then，将 "微任务 3" 放入微任务队列：
  - 微任务队列：[微任务 3]

此时的状态：

- 宏任务队列：[宏任务 2]
- 微任务队列：[微任务 3]

第四步：清空微任务队列

当前宏任务（宏任务 1）执行完毕后，开始清空微任务队列。

- 执行 微任务 3 回调：输出 微任务 3。

此时的状态：

- 宏任务队列：[宏任务 2]
- 微任务队列：[]

第五步：继续执行下一个宏任务

从宏任务队列中取出第一个宏任务（宏任务 2）并执行。

- 输出 "宏任务 2"

深入示例：

```js
console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => {
    console.log('C')
    return Promise.resolve()
  })
  .then(() => console.log('D'))

console.log('E')
```

输出结果：

```
A
E
C
D
B
```

async/await 版：

```js
async function foo() {
  console.log('X') // 函数内部同步代码

  // await 会将后续代码推迟到微任务队列中执行
  await Promise.resolve()
  console.log('Y')
}

console.log('1') // 同步代码

foo() // 同步代码

console.log('2') // 同步代码
```

输出结果：

```
1
X
2
Y
```

## 总结

### 什么是事件循环

事件循环(Event Loop)是 JavaScript 处理异步操作的机制。

它使得 JavaScript 能够在单线程上执行异步操作。

事件循环机制可以有效地协调异步操作和主线程执行任务之间的关系，保证程序的正确性和效率。
同时，事件循环还可以防止 JavaScript 的阻塞，提高程序的响应性能

### 事件循环的执行流程：

- 执行全局代码（第一个宏任务），遇到同步任务直接执行，遇到异步任务（微任务、宏任务），加入到任务队列。
- 当前宏任务执行完毕，执行所有微任务。
- 执行下一个宏任务，重复上述过程。

### 重点：

- 在每个事件循环迭代中，首先会执行一个宏任务（从宏任务队列中取出），然后执行所有已排队的微任务（直到微任务队列为空）。
- 微任务的设计允许你在当前操作结束后立即响应某些状态变化，而无需等待下一次事件循环迭代。这对于需要确保一系列操作在一个逻辑单元内完成是非常有用的，比如在 Promise 链式调用中，确保前一个 then 方法中的操作完成后，紧接着执行下一个 then 方法中的操作，而不是等到下一轮事件循环。
- 宏任务内部的微任务会在当前宏任务执行完后立即执行。
