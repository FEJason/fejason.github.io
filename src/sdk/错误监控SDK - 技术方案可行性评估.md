# 错误监控 SDK - 技术方案可行性评估

---

## 一、核心目标确认

首先明确 SDK 的核心能力需求：

- 捕获 JavaScript 运行时错误（同步、异步、Promise）
- 捕获资源加载错误（img、css、js、script、字体、视频 等）
- 捕获接口请求（XHR、fetch）
- 性能监控（页面渲染性能等）
- 上下文环境信息（浏览器信息、系统信息、设备信息）
- 用户行为轨迹（相当于埋点 SDK）
- 支持 Source Map 解析（生产环境错误定位）
- 数据上报策略（节流、采样、离线缓存、重试）
- 支持多端：Web、H5、移动端 WebView 等

---

## 二、关键技术可行性分析

### **错误捕获能力**

| 错误类型           | 技术方案                                            | 可行性 | 备注                            |
| ------------------ | --------------------------------------------------- | ------ | ------------------------------- |
| JS 同步错误        | `window.onerror`                                    | 高     | 基础支持                        |
| Promise 未处理拒绝 | `unhandledrejection` 事件                           | 高     | 现代浏览器支持良好              |
| 异步回调错误       | try-catch + 包装器（如 setTimeout 包装）            | ⚠️ 中  | 无法 100% 覆盖，但可提升覆盖率  |
| 资源加载失败       | `addEventListener('error', ..., true)` 捕获冒泡阶段 | 高     | 需注意 script/style 的跨域限制  |
| XHR/fetch 错误     | 代理 `XMLHttpRequest` / `fetch`                     | 高     | 成熟方案（如 Sentry、FunDebug） |

#### 1. **JavaScript 运行时错误捕获**

- **可行性：高**
- **技术手段**：
  - `window.onerror`：捕获同步错误
  - `window.addEventListener('error', ...)`：可捕获部分异步错误（但不如 onerror 全）
  - `window.addEventListener('unhandledrejection', ...)`：捕获未处理的 Promise reject
- **注意点**：
  - 跨域脚本需添加 `crossorigin="anonymous"` 并配置 CORS，否则堆栈信息被屏蔽（"Script error."）
  - 需结合 try/catch 补充框架内错误（如 React 的 Error Boundary）

> **结论**：成熟方案，可稳定实现。

---

#### 2. **资源加载错误捕获（img/css/js 等）**

- **可行性：中高**
- **技术手段**：
  - 全局监听 `window.addEventListener('error', ..., true)`（捕获冒泡阶段前的错误）
  - 静态资源需提前绑定 `onerror`（动态插入的资源较难覆盖）
- **限制**：
  - 已经加载完成的资源无法回溯
  - 第三方 CDN 资源若无 CORS，可能无法获取具体 URL 或错误详情
  - 字体、视频等媒体资源错误类型较杂，需分类处理

> **结论**：可实现，但需接受部分“静默失败”场景无法捕获。

---

#### 3. **接口请求监控（XHR / fetch）**

- **可行性：中**
- **技术手段**：
  - **XHR**：通过 `XMLHttpRequest.prototype.open/send` 打桩（monkey patch）
  - **fetch**：重写 `window.fetch`，包装 Promise
- **挑战**：
  - 需处理请求/响应头、状态码、耗时、失败原因
  - 避免与现有请求库（如 axios）冲突
  - 防止无限递归（如上报本身也是 fetch）
  - 隐私敏感：避免上报敏感数据（如 token、用户信息），需提供过滤/脱敏机制

> ⚠️ **结论**：可行，但需谨慎设计拦截逻辑和安全策略。

---

### **性能监控（FP / FCP / LCP / TTFB / FID / CLS 等）**

- **可行性：高**
- **技术手段**：
  - 使用 [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
    - `performance.getEntriesByType('navigation')`
    - `performance.getEntriesByType('paint')`
    - `new PerformanceObserver(...)` 监听 LCP、CLS、FID（需 polyfill 旧浏览器）
- **指标支持**：
  - Web Vitals（Google 推荐）可完整采集
  - 自定义首屏时间可通过 `requestIdleCallback` + DOM 尺寸判断

> **结论**：标准 API 支持良好，推荐集成。

---

### **上下文环境信息采集**

- **可行性：中高**
- **可采集内容**：
  - `navigator.userAgent`
  - `screen.width/height`
  - `window.innerWidth/Height`
  - 设备像素比 `devicePixelRatio`
  - 网络类型（`navigator.connection.effectiveType`，仅 HTTPS）
  - 语言、时区、电池状态（可选）
- **注意**：部分 API 在 iOS Safari 或低版本浏览器中受限

> **结论**：基础信息易获取，高级信息需降级处理。

---

---

### **用户行为轨迹（点击、路由、滚动、输入等，相当于一个埋点 SDK）**

- **可行性：中高**
- **技术手段**：
  - 监听 `click`、`scroll`、`input`、`keydown` 等事件（节流防爆）
  - 拦截 `history.pushState` / `replaceState` 捕获 SPA 路由变化
  - 记录最近 N 条行为作为“错误上下文快照”
- **挑战**：
  - 性能开销：需严格控制采样率和事件频率
  - 隐私合规：避免记录密码、银行卡等敏感输入（需自动脱敏或忽略特定字段）
  - 内存泄漏：行为队列需有上限并及时清理

> **结论**：可行，但需平衡体验与监控粒度，建议默认关闭或低频采样。

---

### **Source Map 解析**

Source Map 是一种用于映射 JavaScript 源代码的格式。不能部署在生产环境，需要配合 Source Map 服务器。

- **客户端解析**：不允许（暴露源码、性能差、安全风险）
- **服务端解析**：上传 sourcemap 到监控平台，SDK 仅上报压缩后错误位置，由后端反解，得到源代码位置。

**推荐服务端反解**，技术可行且安全。

> 注意：需配套构建流程自动上传，每一次构建都需要上传最新的 sourcemap 文件。

- 小程序：需要在每次生产构建时上传 sourcemap 文件（容易遗漏）。
- 其它 CI、CD 项目：所有使用 SDK 的项目，运维生产构建都需要配置自动上传 sourcemap 文件到监控平台。

**结论**：SDK 不负责解析，只负责上报原始堆栈；需配套后端能力。

---

### **数据上报策略**

- **可行性：高**
- **关键策略**：
  - **节流**：同一错误短时间内只报一次（基于 stack + message 哈希）
  - **采样**：高流量站点可按比例丢弃（如 10%）
  - **离线缓存**：使用 `localStorage` 或 `IndexedDB` 缓存未发送数据
  - **重试机制**：失败后指数退避重试（最多 3 次）
  - **Beacon 优先**：使用 `navigator.sendBeacon()` 保证页面卸载时上报
- **注意**：避免上报阻塞主线程

**结论**：成熟模式，建议实现。

---

### **多端兼容性**

| 环境                                | 兼容性   | 说明                  |
| ----------------------------------- | -------- | --------------------- |
| 现代浏览器（Chrome/Firefox/Safari） | 完全支持 |
| 移动端 WebView（iOS/Android）       | 支持     | 依赖系统 WebView 版本 |

**整体可行**

---

### **性能影响评估**

- **体积**：目标 ≤ 10KB（gzip 后），可通过 tree-shaking 优化
- **运行时开销**：
  - 事件监听：低（O(1)）
  - 行为记录：中（需控制队列长度）
  - 上报：异步、节流（如每分钟最多上报 5 次）

**可控**，参考 Sentry Lite (~8KB)，对用户体验影响极小。

---

### **数据安全与合规**

- **敏感信息过滤**：自动屏蔽 URL 参数（如 token）、表单内容
- **GDPR/CCPA 合规**：提供关闭 API（`sdk.disable()`）
- **上报域名可控**：支持自定义 endpoint，避免第三方依赖

**可行**，但需在设计阶段嵌入隐私保护机制。

---

### **部署与集成成本**

- **接入方式**：
  - CDN script 标签（最简单）
  - NPM 包（支持 ES Module / CommonJS）
- **初始化代码**：通常 3~5 行
- **是否侵入业务代码**：否（无须修改原有逻辑）

**集成成本极低**，适合大规模推广。

---

## 三、整体可行性结论

| 维度           | 评估                                                              |
| -------------- | ----------------------------------------------------------------- |
| **技术可行性** | **整体可行**，所有核心功能均有实现方案                            |
| **实现复杂度** | ⚠️ **高**：需处理大量边界情况、兼容性、性能、隐私问题             |
| **维护成本**   | ⚠️ 较高：需持续跟进浏览器变更、安全策略（如 Cookie、CSP）、新 API |
| **推荐路径**   | 自研，建议分阶段上线：先错误捕获 → 再性能 → 再行为轨迹            |

---

## 四、潜在风险与应对

| 风险                                 | 应对措施                                      |
| ------------------------------------ | --------------------------------------------- |
| SDK 自身报错导致雪崩                 | 严格 try-catch + 自保护机制                   |
| 上报风暴（高频错误）                 | 采样率控制（如 10%）、错误去重（fingerprint） |
| 跨域脚本错误信息模糊（Script error） | 配置 CORS + `crossorigin="anonymous"`         |
| 微前端环境下错误丢失                 | 提供子应用手动初始化接口                      |

---

进一步：

- SDK 架构设计图
- 核心代码模板（IIFE 封装）
- 上报协议设计（JSON Schema）
- 性能压测方案
