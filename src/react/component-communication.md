# React 组件通信

组件通信的方式有以下几种：

- 父组件向子组件
- 子组件向父组件
- 兄弟组件之间
- 父组件向后代组件传递
- 非关系组件传递

## 父组件向子组件传递

由于`React`的数据流动为单向，父组件向子组件传递是最常见的方式。

> 关于单向数据流(Vue 官方文档)：  
> 所有的 props 都遵循着单向绑定原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。  
> 这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。  
> 另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你不应该在子组件中去更改一个 prop

父组件在调用子组件的时候，只需要在子组件标签传递参数，子组件通过`props`属性就能接收父组件传递过来的参数。

```jsx
// 父组件
;<Test email="xxx@163.com" />

// 子组件
function Test(props) {
  return (
    <>
      <input value={props.email} />
    </>
  )
}
```

## 子组件向父组件传递

子组件向父组件通信的基本思路是，父组件向子组件传递一个函数，然后通过这个函数的回调，拿到子组件传过来的值；

`Vue` 通过监听事件，`React` 是通过属性传递一个函数

```jsx
// 父组件
function Parent() {
  const handleChange = value => {
    console.log('🚀 ~ handleChange ~ value:', value)
  }

  return (
    <>
      <div>
        <Child onChange={handleChange} />
      </div>
    </>
  )
}
```

```jsx
// 子组件
import { useState } from 'react'

function Child({ onChange }) {
  const [inputValue, setInputValue] = useState('')

  const handleChange = value => {
    setInputValue(value)
    onChange(value) // 调用父组件传递过来的回调函数
  }

  return (
    <>
      <input value={inputValue} onChange={e => handleChange(e.target.value)} />
    </>
  )
}

export default Child
```

## 兄弟组件之间通信

和`Vue`一样，兄弟组件之间传递数据，使用父组件作为中间层来实现数据传递。

父组件向子组件 A 传递一个函数，通过这个函数的回调，拿到子组件 A 传过来的值，

在回调函数中修改父组件的状态，父组件状态更新后，子组件 B 中的 props 会被更新到最新值。

```jsx
// 父组件
function Parent() {
  const [childState, setChildState] = useState('')

  const handleChange = value => {
    setChildState(value)
  }

  return (
    <div>
      <h1>父组件</h1>
      <ChildA onChange={handleChange} />
      <ChildB childState={childState} />
    </div>
  )
}

export default Parent
```

## 父组件向后代组件传递

使用 Context API:

- 创建一个 `Context` 对象和一个 `Provider` 组件。
- 父组件使用 `Provider` 包裹其子组件树，并提供共享的数据。
- 后代组件通过 `useContext` 钩子来访问 `Context` 中的数据。
- 这种方法可以避免 `prop-drilling` (组件逐层传递 props)，适用于深层次的后代组件。

创建 Context

```js
// MyContext.js
import React from 'react'

const MyContext = React.createContext()

export const MyProvider = ({ children }) => {
  const data = '这是从父组件传递的数据'

  return <MyContext.Provider value={data}>{children}</MyContext.Provider>
}

export default MyContext
```

父组件 (App.js)

```js
import { MyProvider } from './MyContext'
import ChildComponent from './ChildComponent'

function App() {
  return (
    <div>
      <h1>父组件</h1>
      <MyProvider>
        <ChildComponent />
      </MyProvider>
    </div>
  )
}

export default App
```

子组件 (ChildComponent.js)

```js
import GrandchildComponent from './GrandchildComponent'

function ChildComponent() {
  return (
    <div>
      <h2>子组件</h2>
      <GrandchildComponent />
    </div>
  )
}

export default ChildComponent
```

后代组件 (GrandchildComponent.js)

```js
import React, { useContext } from 'react'
import MyContext from './MyContext'

function GrandchildComponent() {
  // 后代组件通过 useContext 钩子来访问 Context 中的数据
  const data = useContext(MyContext)

  return (
    <div>
      <h3>后代组件</h3>
      <p>{data}</p>
    </div>
  )
}

export default GrandchildComponent
```

## 非关系组件

`Redux` 是一个状态管理库，可以帮助你在整个应用中管理和共享状态。

## 总结

Vue 和 React 都采用了单向数据流（Unidirectional Data Flow）的概念，但它们在实现细节上有一些不同。

### React

React 从一开始就是基于单向数据流的设计理念。在 React 中，数据总是从父组件流向子组件，通过 props 传递。如果子组件需要向父组件传递数据，通常通过回调函数（callback functions）来实现。这种设计使得数据流清晰明了，便于理解和调试。

### Vue

Vue 也采用了单向数据流的设计，但它的实现方式更为灵活。在 Vue 中，数据同样是从父组件流向子组件，通过 props 传递。如果子组件需要向父组件传递数据，通常通过 `$emit` 触发自定义事件来实现。此外，Vue 还提供了 `v-model` 和 `sync` 修饰符来简化双向绑定。

### 主要区别

1. 数据传递：

- React：通过 `props` 传递数据，子组件通过回调函数向父组件传递数据。
- Vue：通过 `props` 传递数据，子组件通过 `$emit` 触发自定义事件向父组件传递数据。

2. 双向绑定：

- React：通常通过回调函数和状态管理来实现双向绑定。
- Vue：提供了 `v-model` 和 `sync` 修饰符来简化双向绑定。

3. 灵活性：

- React：更加严格地遵循单向数据流，强调数据流动的方向性。
- Vue：虽然也是单向数据流，但在某些情况下提供了更多的灵活性，如 `v-model` 和 `sync`。
