# 前端 SDK（Application Side SDK）需求

## 核心设计原则

- 接入极简：1 行代码初始化，支持多方式集成。
- 性能无损：包体积 ≤ 10KB（gzip），页面加载耗时增加 ≤ 5ms。
- 数据可靠：极端场景（页面关闭、离线）下数据不丢失。
- 兼容广泛：支持 Chrome 80+、Firefox 75+、Safari 13+、Edge 80+，主流前端框架（Vue/React/Next.js 等）。

## 集成方式

| 集成方式 | 适用场景             | 集成示例                                                                                                                                        |
| -------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| CDN      | 非框架应用、快速验证 | `<script src="https://sentinel-cdn.com/sdk/v1/sentinel.js"></script> `                                                                          |
| NPM      | 框架应用、工程化项目 | npm install @sentinel/web-sdk --save <br> import Sentinel from "@sentinel/web-sdk"; <br> Sentinel.init({ appId: "app-xxx", appSecret: "xxx" }); |

## 核心采集功能

| 采集类别                   | 优先级 | 采集内容                                                                                                                                                                                                               | 关键字段                                                             |
| -------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| JS 异常                    | P0     | 1. 运行时错误（window.onerror）<br> 2. Promise 错误（unhandledrejection）<br> 3. 框架错误（Vue.config.errorHandler、React ErrorBoundary）<br> 4. 自定义错误（支持手动上报）                                            | 错误类型、错误消息、错误栈、文件名、行号、列号                       |
| 资源加载错误               | P0     | 图片、CSS、JS、字体、视频等静态资源加载失败                                                                                                                                                                            | 资源 URL、资源类型、加载状态码、触发元素、页面 URL                   |
| 接口请求监控               | P0     | XHR/Fetch 请求拦截，覆盖所有 HTTP 方法                                                                                                                                                                                 | 请求 URL、方法、状态码、耗时、请求体大小、返回体大小、错误信息       |
| 性能监控                   | P0     | 1. 核心 Web Vitals（FCP、LCP、FID、CLS）<br> 2. 页面加载指标（白屏时间、首屏时间、TTFB、页面完全加载时间）<br> 3. 资源加载耗时（DNS 解析、TCP 连接、SSL 握手）                                                         | 指标名称、数值（ms）、采样时间、页面 URL                             |
| 上下文环境信息             | P0     | 1. 浏览器信息（名称、版本）<br> 2. 系统信息（OS 名称、版本）<br> 3. 设备信息（设备类型、屏幕分辨率、网络类型）<br> 4. 业务信息（appVersion、用户 ID、页面 URL、Referrer）<br> 5. 地理位置（基于 IP 解析，可选）        | appId、appVersion、userId、browser、os、deviceType、networkType、url |
| 用户行为轨迹（Breadcrumb） | P0     | 1. 点击事件（元素选择器、XPath、文本内容）<br> 2. 路由变化（前路由、后路由、跳转方式）<br> 3. 接口调用（URL、方法、状态码）<br> 4. Console 输出（error/warn/info）<br> 5. 存储操作（localStorage/sessionStorage 读写） | 事件类型、事件描述、发生时间、关联数据、顺序索引                     |

## 错误级别与类型定义

| 级别   | 标识     | 错误类别       | 类别标识                   | 核心定义                                                                                              | 典型场景说明                                                  |
| ------ | -------- | -------------- | -------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 致命级 | Critical | 页面崩溃       | `page_crash`               | 导致页面崩溃或 Tab 闪退，用户必须重新加载页面。                                                       | 浏览器内存溢出、核心 Web Worker 线程死亡。                    |
| 致命级 | Critical | 全局 JS 错误   | `js_error_global`          | 核心框架（如 Vue/React）初始化失败，页面白屏，无任何内容展示。                                        | Vue 初始化时挂载点不存在、顶层 JS 文件有语法错误。            |
| 致命级 | Critical | 核心资源失败   | `resource_error_core`      | 核心 CSS/JS 文件加载 404 或网络超时。<br>阻止首屏渲染的关键资源加载失败，导致页面功能或样式完全缺失。 | 页面关键脚本或样式未加载成功。                                |
| 致命级 | Critical | SDK 故障       | `sdk_init_error`           | 监控 SDK 自身初始化失败，导致所有监控数据无法采集上报。                                               | SDK 配置错误或依赖加载失败。                                  |
| 严重级 | Severe   | 核心接口失败   | `api_request_core`         | 交易、登录、提交订单等核心业务接口返回 5xx 或业务失败码。                                             | 支付接口返回 500 错误、注册接口返回“用户已存在”但未明确提示。 |
| 严重级 | Severe   | 核心逻辑错误   | `logic_error_core`         | 核心业务逻辑执行失败，用户无法继续下一步操作。                                                        | 表单提交后数据未保存、结算按钮点击后无反应。                  |
| 严重级 | Severe   | 路由跳转失败   | `route_error`              | 单页应用内部路由跳转失败，用户被困在当前页面。                                                        | Vue Router 或 React Router 动态加载组件失败。                 |
| 严重级 | Severe   | Promise 拒绝   | `unhandledrejection`       | 关键异步操作（Promise）未捕获的异常。                                                                 | 异步获取数据失败，但未用 `.catch()` 处理，可能影响后续依赖。  |
| 一般级 | Moderate | 非核心资源失败 | `resource_error_non_core`  | 非核心图片、广告或次要 JS 文件加载失败。                                                              | 页面底部的推荐列表图无法加载、次要的统计脚本 404。            |
| 一般级 | Moderate | 局部样式错乱   | `style_error_partial`      | DOM 操作或样式计算错误导致的页面局部错乱。                                                            | 次要导航栏图标显示异常、部分浮层定位错误。                    |
| 一般级 | Moderate | 接口请求超时   | `api_request_timeout`      | 非核心数据接口请求超时，如获取推荐列表、用户头像等。                                                  | 页面加载时间被延长，但用户仍可进行核心操作。                  |
| 一般级 | Moderate | LCP 超标       | `webvitals_lcp_high`       | 最大内容绘制 (LCP) 指标突破 4.0s（差标准）。                                                          | 页面主要内容加载缓慢，用户体验下降。                          |
| 轻微级 | Minor    | 控制台警告     | `console_warn`             | `Console.warn` 或 `Console.info` 等非阻塞性日志。                                                     | 使用了浏览器已废弃的 API、开发环境下的 Hot Update 提示。      |
| 轻微级 | Minor    | 隐形资源失败   | `resource_error_invisible` | 页面折叠区域或 SEO 专用图片的加载失败。                                                               | 资源加载失败发生在用户当前不可见的区域。                      |
| 轻微级 | Minor    | 交互延迟       | `interaction_delay_minor`  | 次要的 UI 交互响应时间超过 1 秒。                                                                     | “回到顶部”按钮延迟响应、“分享”功能加载图标转圈超过 1 秒。     |
| 轻微级 | Minor    | 性能低分       | `webvitals_low_score`      | 性能指标处于需改进区间，但不达差的标准。                                                              | LCP 处于 2.5s 到 4.0s 之间，需要优化。                        |

## 数据上报与安全策略

| 策略类型       | 核心机制                                                                                                                                                                                                                                                                                                          | 配置说明                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **传输安全**   | 1. 全链路 HTTPS 加密<br>2. 数据体 AES-256-GCM 加密<br>3. Header 签名校验（HMAC-SHA256）<br>4. 签名要素：`appId + timestamp + nonce + payloadHash`                                                                                                                                                                 | 签名 Header 格式：<br>`X-Sentinel-Signature: HMAC-SHA256(appSecret, appId + timestamp + nonce + payloadHash)`         |
| **上报策略**   | 1. 批量上报：默认 10 条数据或 10 秒触发一次<br>2. 即时上报：Critical 级错误（如页面崩溃、核心资源加载失败）立即上报<br>3. 卸载上报：页面卸载前通过 `navigator.sendBeacon()` 兜底上报<br>4. 失败重试：上报失败时指数退避重试（1s、3s、5s），最大 3 次<br>5. 离线缓存：离线时数据存入 IndexedDB，恢复网络后自动上报 | SDK 配置示例：<br>`report: { batchSize: 10, batchInterval: 10000, immediateReportTypes: ["critical_error"] }`         |
| **限流与过滤** | 1. 本地限流：单用户每小时最大上报 1000 条<br>2. 重复过滤：相同指纹错误本地计数，不重复上报<br>3. 自定义过滤：支持 `ignoreErrors`（正则）、`ignoreUrls`（正则）<br>4. 敏感信息脱敏：提供 `beforeSend` 回调，支持自定义脱敏逻辑                                                                                     | 脱敏配置示例：<br>`beforeSend: (data) => { data.url = data.url.replace(/password=.+/, "password=**"); return data; }` |

## 完整 SDK 配置示例

```javascript
Sentinel.init({
  // 必传
  appId: 'app-xxx-123', // 应用唯一标识（控制台获取）
  appSecret: 'secret-xxx-456', // 上报鉴权密钥（控制台获取）

  appVersion: '1.0.0', // 应用版本（支持自动读取 package.json）
  userId: 'user-789', // 可选，用户唯一标识（用于关联用户行为）

  report: {
    batchSize: 10, // 批量上报阈值（默认 10 条）
    batchInterval: 10000, // 批量上报时间间隔（默认 10 秒）
    immediateReportTypes: ['critical_error', 'resource_error', '5xx_api'], // 即时上报类型
    forceReport: true, // 页面卸载时强制上报（默认 true）
    sendBeaconFallback: true, // 卸载时使用 sendBeacon 兜底（默认 true）
    retryCount: 3, // 上报失败重试次数（默认 3 次）
    ignoreErrors: [/Script error/], // 忽略的错误（正则）
    ignoreUrls: [/test\.com/] // 忽略的 URL（正则）
  },

  breadcrumb: {
    maxCount: 30, // 最大存储行为轨迹数（默认 30 条）
    enable: true, // 是否启用行为轨迹（默认 true）
    include: ['click', 'route', 'api', 'console'] // 需采集的行为类型
  },

  performance: {
    enable: true, // 是否启用性能监控（默认 true）
    webVitals: true // 是否采集 Web Vitals（默认 true）
  },

  debug: false, // 调试模式（默认 false，开启后打印日志）

  beforeSend: data => {
    // 自定义数据处理/脱敏逻辑
    if (data.type === 'api_request') {
      data.payload.url = data.payload.url.replace(/token=.*&/, 'token=***&')
    }
    return data
  }
})

// 手动上报错误（支持业务自定义错误）
Sentinel.reportError(new Error('自定义错误'), {
  customTag: 'payment'
})
```

## SDK 在中台可做应用配置

中台可对 SDK 做应用配置，如：

- 是否启用监控
- 采样配置
  - 用户行为回溯数量（错误发生前保留的用户交互行为记录数量：5 条、10 条、20 条）
  - 上报策略
    - 批量上报阈值（默认 10 条）
    - 批量上报时间间隔（默认 10 秒）
    - 即时上报类型
  - 限流与过滤
    - 本地限流：单用户每小时最大上报 1000 条
    - 是否开启重复过滤：相同指纹错误本地计数，不重复上报
    - 忽略的错误（正则）
  - 重试与缓存
    - 失败重试策略 （指数退避，1s、3s、5s）
    - 是否开启离线缓存
- 隐私保护
  - 是否开启 IP 地址脱敏
  - 是否开启用户标识加密
  - 敏感字段过滤（可填：password,token,secret,key...）
  - 脱敏回调函数(可自定义脱敏逻辑)
