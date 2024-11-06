# React 引入 CSS 的方式
在 React 中引入 CSS 不如 Vue 方便简洁。

Vue 使用 CSS 更为简洁：
- 通过 style 标签编写
- scoped 属性实现模块化，样式只在当前组件有效
- lang 属性处理预处理器
- 支持原生内联样式

React 常见的 CSS 引入方式：
- 内联样式
- CSS 文件
- CSS Modules
- CSS in JS

## 内联样式
直接写在组件的 JSX 代码中，适用于简单的样式需求。

```jsx
function App() {
  const styles = {
    color: 'blue',
    fontSize: '20px'
  }

  return (
    <div style={styles}>
      Hello, World!
    </div>
  )
}

export default App
```

## CSS 文件
将样式写在单独的 CSS 文件中，然后在组件中引入。

缺点： 全局样式冲突

可以使用预处理器 sass less ，使用命名空间，或者 CSS 嵌套避免冲突

app.css
```css
.app {
  color: blue;
  font-size: 20px;
}
```

```jsx
// 引入 CSS 文件
import './app.css'

function App() {
  return (
    <div className="app">
      Hello, World!
    </div>
  )
}

export default App
```

## 组件中引入 .module.css 文件
CSS Modules 是一种将 CSS 作用域限制在组件内部的技术，可以避免全局样式冲突。

缺点：
1. 引用的类名不能使用连接符(.xxx-xx)，在 JS 中不识别
2. 所有的 className 都必须使用 {styles.className} 的形式来编写
3. 不方便动态修改某些样式，依然需要使用内联样式的方式

app.modules.css
```css
.app {
  color: blue;
  font-size: 20px;
}
```

```jsx
import styles from './app.module.css'

function App() {
  return (
    <div className={styles.app}>
      Hello, World!
    </div>
  )
}

export default App
```

## CSS-in-JS
CSS-in-JS 是一种将 CSS 样式直接写在 JavaScript 代码中的技术。这种做法的主要目的是为了更好地利用 JavaScript 的动态特性和模块化特性，使得样式管理更加灵活和模块化。

以下是几种流行的 CSS-in-JS 库：
- styled-components
- emotion
- glamorous

### styled-components
styled-components 是最流行的 CSS-in-JS 库之一，它允许你使用模板字符串来编写样式。

安装：
```sh
npm install styled-components
```

使用示例：
```jsx
import styled from 'styled-components'

// 创建一个带有样式的 div
const AppDiv = styled.div`
  color: blue;
  font-size: 20px;
  background-color: lightgray;
  padding: 10px;
  border-radius: 5px;
`

function App() {
  return (
    <AppDiv>
      Hello, World!
    </AppDiv>
  )
}

export default App
```

使用独立的 style.js
```js
// src/styles/style.js
import styled from 'styled-components';

// 定义一个通用的按钮样式
export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

// 定义一个主按钮样式
export const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
`;

// 定义一个次按钮样式
export const SecondaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
`;

// 定义一个容器样式
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
`;

// 定义一个标题样式
export const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 24px;
`;
```

在组件中使用样式
```jsx
// src/components/App.js
import React from 'react'
import { Container, Title, PrimaryButton, SecondaryButton } from '../styles/style'

function App() {
  return (
    <Container>
      <Title>Hello, World!</Title>
      <PrimaryButton>Primary Button</PrimaryButton>
      <SecondaryButton>Secondary Button</SecondaryButton>
    </Container>
  )
}

export default App
```

## 总结
选择合适的 CSS 处理方式取决于你的项目需求和个人偏好。  
CSS-in-JS 适合需要高度动态和模块化样式的项目，  
而 CSS 预处理器和传统 CSS 则适合简单和直接的样式管理的项目。