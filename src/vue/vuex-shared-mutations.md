# vuex-shared-mutations
在多个浏览器标签或窗口之间共享某些 vuex mutations

## 它是如何运行的
最初，这个插件是一个小插件，用于使用 在选项卡之间共享数据localStorage。但是 Internet Explorer 中的几个不一致之处导致整个插件被重写，现在它不再与 localStorage 绑定如果您不提供策略，系统将使用BroadcastChannel（如果可用），如果失败则降级为 localStorage。

## BroadcastChannel
[BroadcastChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel)
Web API 接口代理了一个命名频道，可以让指定 origin 下的任意 browsing context 来订阅它。它允许同源的不同浏览器窗口，Tab 页，frame 或者 iframe 下的不同文档之间相互通信。通过触发一个 message 事件，消息可以广播到所有监听了该频道的 BroadcastChannel 对象。

## Nuxt 使用流程
### 1. 安装依赖
确保已安装 vuex-shared-mutations 插件：

```sh
npm install vuex-shared-mutations
# 或
yarn add vuex-shared-mutations
```

### 2. 创建一个插件文件
在 plugins 文件夹中创建一个插件文件，例如 vuex-shared-mutations.js，并添加以下内容：

```js
import createSharedMutations from 'vuex-shared-mutations';

export default ({ store }) => {
  if (process.client) {
    // window.onNuxtReady 是 Nuxt.js 提供的一个客户端钩子，
    // 用于在客户端应用程序完全初始化并准备好后执行指定的回调函数。
    // 这个钩子确保代码只在浏览器中运行，而不会在服务器端渲染过程中执行。
    window.onNuxtReady(() => {
      createSharedMutations({
        // 想要共享的 mutation 名称数组，模块用 "/"
        predicate: ['increment', 'moduleName/mutatioinName',]
      })(store);
    });
  }
};
```

### 3. 配置 Nuxt.js 加载插件
在 nuxt.config.js 中添加插件配置：

```js
export default {
  // 其他配置项
  plugins: [
    { src: '~/plugins/vuex-shared-mutations.js', mode: 'client' }
  ],
  // ...
}
```

### 4. 配置 Vuex Store
确保你的 Vuex Store 配置正确。例如：

修改 store/index.js
```js
export const state = () => ({
  counter: 0
});

export const mutations = {
  increment(state) {
    state.counter++;
  }
};

```
### 5. 使用 Vuex Store
在组件中使用 Vuex Store：

```js
<template>
  <div>
    <p>Counter: {{ counter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['counter'])
  },
  methods: {
    ...mapMutations(['increment'])
  }
};
</script>
```
通过上述步骤，可以实现在多个浏览器窗口或标签页之间共享 Vuex 的状态变更。