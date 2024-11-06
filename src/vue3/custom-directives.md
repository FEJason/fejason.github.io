# 自定义指令

## 介绍

除了 Vue 内置的一系列指令(比如`v-model`或`v-show`)之外，Vue 还允许你注册自定义的指令(Custom Directives)。

在 Vue 中重用代码的方式：[组件-这里链接待修改](./composables.md)和[组合式函数](./composables.md)。组件是主要的构建模块，而组合式函数则侧重于有状态的逻辑。有些情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。

一个自定义指令由一个包含类似组件生命周期钩子的对象来定义。钩子函数会接收到指令所绑定元素作为其参数。

举个聚焦输入框的例子，当一个 input 元素被 Vue 插入到 DOM 中后，它会被自动聚焦：

```vue
<script setup>
// 在模版中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

<script setup>
const vFocus = {
  mounted: el => {
    el.focus()
  }
}
</script>

<div class="demo">
  <input v-focus placeholder="This should be focused" />
</div>

<style>
.demo input {
  border: 1px solid rgba(60, 60, 60, .29);
  border-radius: 4px;
  padding: 0.2em 0.6em;
  margin-top: 10px;
  background: transparent;
  transition: background-color .5s;
}
</style>

假设你还未点击页面中的其它地方，那么上面这个 input 元素应该会被自动聚焦。

在`<script setup>`中，任何以`v`开头的驼峰式命名的变量都可以被用做一个自定义指令。在上面的例子中，`vFocus`即可以在模版中以`v-focus`的形式使用。

在没有使用`<script setup>`的情况下，自定义指令需要通过`directives`选项注册(和 Vue2 一样，Vue2 中，组件接受一个 `directives`选项)：

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模版中启用 v-focus
    focus: {
      // 当绑定的元素插入到 DOM 中时
      mounted(el) {
        el.focus();
      },
      // 当绑定的元素更新时
      updated(el) {
        el.focus();
      }
    }
  }
}
```

注册一个全局自定义指令:

```js
const app = createApp({})

// 定义 v-focus 自定义指令
const focusDirective = {
  mounted(el) {
    el.focus();
  },
  updated(el) {
    el.focus();
  }
}

// 使 v-focus 在所有组件中都可用
app.directive('focus', focusDirective)
```

> 只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令。

## 指令钩子

一个指令的定义对象可以提供几种钩子函数(都是可选地)：

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUpdate(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```

### 钩子参数

指令的钩子会传递以下几种参数：
- `el`: 指令绑定到的元素。这可以用于直接操作 DOM。
- `binding`: 一个对象，包含以下属性。
  - `value`: 传递给指令的值。例如 `v-my-directive="1 + 1"`，值是`2`。
  - `oldValue`: 之前的值，仅在`beforeUpdate`和`updated`中可用。无论值是否更改，它都可用。
  - `arg`: 传递给指令的参数(如果有的话)。例如在`v-my-directive:foo`中，参数是`foo`。
  - `modifiers`: 一个包含修饰符的对象(如果有的话)。例如在`v-my-directive.foo.bar`中，修饰符对象是`{ foo: true, bar: true }`