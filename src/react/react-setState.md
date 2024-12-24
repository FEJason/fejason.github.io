# setState 执行机制

## state 是什么
普通的变量无法满足修改数据视图自动更新视图。

在 React 中，状态（State）是指组件内部用来存储数据的对象。它允许你为应用程序或特定组件添加可变性。状态是私有的并且完全受控于该组件，可以随时间变化并触发 UI 更新。

useState Hook 提供了这两个功能：
  1. State 变量 用于保存状态数据。
  2. State setter 函数 更新变量并触发 React 再次渲染组件。

```jsx
import { useState } from 'react'

export default function Gallery() {
  // 使用 `useState Hook` 创建了一个叫做 `index` 的状态变量
  // 和一个更新该状态的函数 `setIndex`。初始值为 0。
  // `useState` 返回一个数组，第一个元素是当前状态（`index`），
  // 第二个元素是用来更新状态的函数（`setIndex`）。这种写法利用了 `JavaScript` 的数组解构特性。
  const [index, setIndex] = useState(0)

  // 定义了一个名为 `handleClick` 的函数，当按钮被点击时会调用此函数。
  // 在 `handleClick` 中，调用了 `setIndex` 并传递了 `index + 1` 作为参数，
  // 这会导致 `index` 状态增加 1，并触发组件重新渲染以反映新的状态值。
  function handleClick() {
    setIndex(index + 1)
  }

  return (
    <>
      <h2>{index}</h2>
      <button onClick={handleClick}></button>
    </>
  )
}
```

如果直接修改`state`的状态，如下：
```jsx
let index = 0
function handleClick() {
  index += 1
}
```
我们会发现页面不会有任何的反应。

这是因为`React`并不像`Vue2`中调用`Object.defineProperty`数据响应式或者`Vue3`调用`Proxy`监听数据变化。

必须通过`setState`方法来告知`react`组件`state`已经发生改变。

## 异步更新
在 React 中，状态更新本质上是异步的，这是为了优化性能和确保更好的用户体验

这种设计有几个好处：

- 性能优化：通过批量处理多个状态更新，React 可以减少不必要的重渲染次数，从而提高应用的性能。
- 避免中间状态：确保所有相关的状态更新都一起生效，可以防止在一次事件处理过程中出现不一致的中间状态。

```jsx
function handleClick() {
  console.log('之前 setIndex:', index) // 假设此时 index 是 0
  setIndex(index + 1)
  console.log('之后 setIndex:', index) // 这里仍然会输出 0，因为状态更新是异步的
}
```
在这个例子中，即使你调用了 `setIndex`，紧接着的日志语句也会打印出旧的状态值 (0)，这是因为状态更新尚未完成。如果你需要基于最新的状态执行某些逻辑，应该使用 `useEffect` 或者在事件处理函数中直接操作。


这里有个展示其运行原理的小例子。在这个例子中，你可能会以为点击“+3”按钮会调用 setNumber(number + 1) 三次从而使计数器递增三次。

```jsx
import { useState } from 'react'

export default function Counter() {
  const [number, setNumber] = useState(0)

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1)
        setNumber(number + 1)
        setNumber(number + 1)
      }}>+3</button>
    </>
  )
}
```
注意，每次点击只会让 `number` 递增一次！

按钮的点击事件处理函数通知 React 要做的事情：

1. setNumber(number + 1)：number 是 0 所以 setNumber(0 + 1)。
  - React 准备在下一次渲染时将 number 更改为 1。
2. setNumber(number + 1)：number 是0 所以 setNumber(0 + 1)。
  - React 准备在下一次渲染时将 number 更改为 1。
3. setNumber(number + 1)：number 是0 所以 setNumber(0 + 1)。
  - React 准备在下一次渲染时将 number 更改为 1。

尽管你调用了三次 setNumber(number + 1)，但在 这次渲染的 事件处理函数中 number 会一直是 0，所以你会三次将 state 设置成 1。这就是为什么在你的事件处理函数执行完以后，React 重新渲染的组件中的 number 等于 1 而不是 3。


试着猜猜点击这个按钮会发出什么警告：
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0)

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5)
        alert(number) // 这里会弹出什么
      }}>+5</button>
    </>
  )
}
```
如果你使用之前替换的方法，你就能猜到这个提示框将会显示 “0”：

但如果你在这个提示框上加上一个定时器， 使得它在组件重新渲染 之后 才触发，又会怎样呢？
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5)
        setTimeout(() => {
          alert(number) // 这里会弹窗什么
        }, 3000)
      }}>+5</button>
    </>
  )
}
```
视图 number 会变成 5， alert 会弹出 0

一个 state 变量的值永远不会在一次渲染的内部发生变化，即使其事件处理函数的代码是异步的。


## 在下次渲染前多次更新同一个 state

万一你想在重新渲染之前读取最新的 state 怎么办？

如果你想在下次渲染之前多次更新同一个 `state`，你可以像 `setNumber(n => n + 1)` 这样传入一个根据队列中的前一个 `state` 计算下一个 `state` 的 函数，而不是像 `setNumber(number + 1)` 这样传入 下一个 `state` 值。这是一种告诉 `React` “用 `state` 值做某事”而不是仅仅替换它的方法。

```jsx
import { useState } from 'react'

export default function Counter() {
  const [number, setNumber] = useState(0)

  return (
    <>
      {/* 点击一次按钮，页面视图会变成3 */}
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1)
        setNumber(n => n + 1)
        setNumber(n => n + 1)
      }}>+3</button>
    </>
  )
}
```
在这里，`n => n + 1` 被称为 更新函数。当你将它传递给一个 `state` 设置函数时：

`React` 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理。
在下一次渲染期间，`React` 会遍历队列并给你更新之后的最终 `state`。

## 如果你在替换 state 后更新 state 会发生什么

这个事件处理函数会怎么样？你认为 number 在下一次渲染中的值是什么？
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      {/* 点击button后， 这里的number会是什么 */}
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5)
        setNumber(n => n + 1)
      }}>增加数字</button>
    </>
  )
}
```
这是事件处理函数告诉 React 要做的事情：

1. setNumber(number + 5)：number 为 0，所以 setNumber(0 + 5)。React 将 “替换为 5” 添加到其队列中。
2. setNumber(n => n + 1)：n => n + 1 是一个更新函数。 React 将 该函数 添加到其队列中。

在下一次渲染期间，React 会遍历 state 队列：

React 会保存 6 为最终结果并从 useState 中返回。


## 总结
在 React 中，状态更新本质上是异步的，这是为了优化性能和确保更好的用户体验。然而，如果你确实需要同步地获取状态更新后的值（例如，当你需要立即基于新的状态执行某些逻辑），你可以采取以下几种方法来实现类似的效果：

1. 使用回调函数形式的状态更新  
当你的新状态依赖于前一个状态时，你可以传递一个更新函数给 `setState`。这个函数接收前一个状态作为参数，并返回一个新的状态。这不会使状态更新变成同步的，但它可以确保你总是基于最新的状态进行计算。
```jsx
setNumber(n => n + 1)
```

2. 使用 useEffect Hook 监听状态变化  
useEffect 可以用来监听状态的变化并在状态更新后执行副作用。它会在组件挂载、更新或卸载时运行指定的代码块。通过这种方式，你可以“响应式”地处理状态变化，虽然这不是真正的同步，但它提供了一种方式来保证在状态更新之后执行特定逻辑。

```jsx
import { useState, useEffect } from 'react'

export default function Gallery() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // 这个效果将在 index 状态改变后触发
    console.log('Index has changed:', index);
  }, [index]) // 注意这里的依赖数组

  function handleClick() {
    setIndex(index + 1)
  }

  return (
    <>
      <h2>{index}</h2>
      <button onClick={handleClick}>Increment</button>
    </>
  )
}
```

setState 主要通过以下步骤工作：

#### 1. 调用 setState：
当组件内部调用 setState 方法时，它实际上是在调用由 React 创建的 hook 函数（例如 useState 或者类组件中的 this.setState）。这些函数会将状态更新请求添加到一个队列中。
#### 2. 创建更新对象：
每次调用 setState 都会创建一个更新对象（update object），这个对象包含了新状态的值（或计算新状态的函数）以及其他元数据（如优先级等）。
#### 3. 挂起更新：
更新对象被添加到该组件的状态队列（fiber node queue）中。React 使用 Fiber 架构来管理这些更新，允许它暂停、恢复和重新排列任务以优化性能。
#### 4. 批量处理更新：
如果有多个 setState 调用几乎同时发生（例如，在同一个事件处理器中），React 会尝试将它们合并成一次更新，以减少不必要的渲染次数。
#### 5. 触发重渲染：
最终，当所有更新都被处理完毕后，React 会根据新的状态来协调（reconcile）并重新渲染组件树。这包括检查哪些部分发生了变化，以及仅更新那些确实改变了的DOM节点。
#### 6. 同步更新：
对于某些需要立即执行的情况，React 提供了 flushSync API （React 17 开始引入） 来确保状态更新立即生效。