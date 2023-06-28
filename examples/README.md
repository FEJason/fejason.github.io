# 案例预览目录

## 目录介绍
```
|-- vue2
|-- vue3
```

## 使用方式

将打包好的静态项目放在`examples/vue2`，那么预览地址为：https://fejason.github.io/examples/vue2/

## 注意事项

### 1. 只能部署 hash 路由
由于`GitHub Pages`，只能部署静态页面的原因，静态文件服务器

### 2. 需要配置 publicPath

由于应用被部署在一个子路径上，你就需要指定这个子路径。例如，应用被部署在`https://fejason.github.io/examples/vue2/`，则设置`publicPath`为`/examples/vue2/`

也可以配置`publicPath: './'`为相对路径。

这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径。

如果`publicPath`配置为`/`, 会导致资源加载到域名的根路径：https://fejason.github.io/assets/css/app.06d9b82a.css ，这样无法找到文件。

正确路径应该为：https://fejason.github.io/examples/vue2/assets/css/app.06d9b82a.css

```javascript
// vue.config.js
module.exports = {
  publicPath: './' // 所有的资源文件访问相对地址
}
```