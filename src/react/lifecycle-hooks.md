# React 生命周期钩子

和`Vue`一样，`React`整个组件生命周期包括从创建、初始化数据、编译模版、挂载DOM -> 渲染、更新 -> 渲染、卸载等一系列过程。

## 流程
这里主要介绍`React16.4`之后的生命周期，可以分成三个阶段：
- 创建阶段
- 更新阶段
- 卸载阶段

### 创建阶段
创建阶段主要分成以下几个生命周期：
- constructor
- getDerivedStateFromProps
- render
- componentDidMount // 组件挂载到真实DOM节点后执行，多用于执行数据获取，事件监听等操作

### 更新阶段
- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate // 组件更新结束触发

### 卸载阶段
- componentWillUnmount // 卸载前，清理一些注册的监听事件

`React16.4`生命周期减少了以下三种方法：
- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

其实这三个方法仍然存在，只是在前者加上了`UNSAFE_`前缀，
如`UNSAFE_componentWillMount`，并不像字面意思那样表示不安全，而是表示这些生命周期的代码可能在未来的`React`版本中废除
