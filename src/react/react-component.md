# React 中类组件和函数式组件

## 类组件

类组件，顾名思义，也就是通过使用`ES6`类的编写的组件，该类必须继承`React.Component`

如果要访问父组件传递过来的参数，可以通过`this.props`的方式访问

在组件中必须实现`render`方法，在`return`中返回`React`对象，如下：

```js
class Test extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

## 函数组件

函数组件，顾名思义，就是通过函数编写的形式去实现一个`React`组件，是`React`中定义组件最简单的方式

```js
function Test(props) {
  return <h1>Hello, {props.name}</h1>
}
```
函数第一个参数为`props`用于接收父组件传递过来的参数

## 区别

针对两种`React`组件，主要有以下区别
- 编写形式
- 状态管理
- 生命周期
- 调用方式
- 获取渲染的值

### 编写形式

两者最明显的区别在于编写形式的不同，同一种功能的实现可以分别对应类组件和函数组件的编写形式

### 状态管理

类组件对应如下：

```js
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  handleClick = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }))
  }
  render() {
    return <button onClick={this.handleClick}>{this.state.count}</button>
  }
}
```

在`hooks`出来之前，函数组件就是无状态组件，不能保管组件状态，不像类组件中调用`setState`

`hooks`出来后，管理`state`状态，可以使用`useState`

函数组件对应如下：

```js
function Test() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 生命周期

在函数组件中，并不存在生命周期，这是因为这些生命周期钩子都来自于继承的 `React.Component`，所以，如果用到生命周期，就只能使用类组件。

但函数组件使用`useEffect`也能够完成替代生命周期的作用：

```js
function Test() {
  useEffect(() => {
    // 组件挂载时执行

    return () => {
      // 组件卸载时执行
    }
  }, []) // 第二个参数，[] 表示只在组件挂载时（即首次渲染时）执行

  return <h1>Hello, React</h1>
}
```

上述简单的例子对应类组件中的`componentDidMount`生命周期

如果在`useFffect`回调函数中`return`一个函数，则`return`函数会在组件卸载的时候执行，对应类组件的`componentWillUnmount`生命周期

### 调用方式

如果是一个函数组件，调用则是执行函数即可：

```js
function Test() {
  return <h1>Hello, React</h1>
}

// React 内部
const result = Test(props) // <h1>Hello, React</h1>
```

如果是一个类组件，则需要将组件进行实例化，然后调用实例对象的`render`方法：

```js
class Test extends React.Component {
  render() {
    return <h1>Hello, React</h1>
  }
}

// React 内部
const instance = new Test(props) // Test {}
const result = instance.render() // <h1>Hello, React</h1>
```

### 获取渲染的值

函数组件对应如下：

```js
function Test() {
  // 使用 useState Hook 初始化状态
  const [isToggleOn, setIsToggleOn] = useState(true);

  // 定义点击处理程序
  const handleClick = () => {
    setIsToggleOn(prevIsToggleOn => !prevIsToggleOn);
  }

  return (
    <button onClick={handleClick}>{isToggleOn ? 'ON' : 'OFF'}</button>
  )
}
```

类组件对应如下：

```js
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isToggleOn: true
    }
  }
  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }
  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>{this.state.isToggleOn ? 'ON' : 'OFF'}</button>
    )
  }
}
```

两种方式实现的功能是一样的，但是在类组件中，调用状态需要使用`this`，调用类的方法也需要使用`this`，还需要矫正`this`指向。

在 `JavaScript` 中，函数内的 `this` 值取决于函数是如何被调用的。

使用 `bind` 的主要原因是确保事件处理器中的 `this` 指向当前组件实例。

在 `handleClick` 方法中，`this` 是指当前组件实例。

然而，在 `onClick` 回调中，如果没有绑定 `this`，那么 `this` 的值将不再是组件实例，

而是 `window`（在浏览器环境中）或者是全局的 `global` 对象（在 Node.js 环境中）。

不使用 `bind` 的方法:

1. 定义阶段使用箭头函数绑定

在 ES6 中，你可以直接在类声明中定义方法，并使用箭头函数来自动绑定 this。箭头函数不会创建自己的 this 上下文，而是捕获定义它的上下文。

```js
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isToggleOn: true
    }
  }

  // 使用箭头函数定义方法
  handleClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.state.isToggleOn ? 'ON' : 'OFF'}</button>
    );
  }
}
```

2. 在构造函数中绑定

可以在构造函数中绑定方法。

```js
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isToggleOn: true
    }
    
    // 在构造函数中绑定方法
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (){
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.state.isToggleOn ? 'ON' : 'OFF'}</button>
    )
  }
}
```

3. 事件处理器内绑定，在回调中使用箭头函数

你也可以在 `render` 方法中绑定方法，但这通常被认为是反模式，因为它会导致每次渲染时都创建新的函数实例，从而增加不必要的性能开销。

通常建议使用箭头函数或使用在构造函数中绑定的方式

```js
class Test extends React.Component {
  state = {
    isToggleOn: true
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }))
  }

  render() {
    return (
      <button onClick={() => this.handleClick()}>{this.state.isToggleOn ? 'ON' : 'OFF'}</button>
    )
  }
}
```

## 总结

函数组件语法更短、更简单，这使它更容易开发、理解和测试。

而类组件会因为大量使用`this`而让人感到困惑。

`React` 的 `Hooks` 是在 `React 16.8` 版本中引入的。

这一特性允许你在函数组件中使用状态和其他 `React` 特性，而不需要编写类组件。

在 `Hooks` 之前，如果你想在组件中有状态（state）或者生命周期（lifecycle）方法，你需要使用类组件。

`Hooks` 的意义：

- 简化状态管理：`useState` 使得在函数组件中管理状态变得简单。
- 生命周期管理：`useEffect` 允许你在函数组件中执行副作用操作，如设置事件监听器、清除定时器等。
- 条件渲染：`useContext` 使得在组件树中传递数据变得简单。
- 性能优化：`useMemo` 和 `useCallback` 可以帮助优化性能，避免不必要的重新计算或重新创建函数。
