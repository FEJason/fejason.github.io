# 错误监控平台中台对前端 SDK 的远程配置能力

**错误监控平台中台对前端 SDK 的远程配置能力（Remote Config）**，这是实现“统一治理、灵活调控、安全合规”的关键功能。

下面我将这部分需求整理为 **结构化的产品/技术方案文档**，包含：

1. ✅ **中台配置项清单（表格）**
2. ✅ **配置下发机制说明**
3. ✅ **SDK 端配置合并逻辑**
4. ✅ **安全与优先级策略**

---

### SDK配置项清单（面向应用维度）

| 配置模块 | 字段 | 类型 | 默认值 | 说明 |
|--------|------|------|-------|------|
| **基础开关**     | `enabled` | `boolean` | `true`| 是否启用监控（关闭后 SDK 不采集不上报） |
| **用户行为回溯** | `sampling.breadcrumbMaxCount` | `5 \| 10 \| 20` | `5` | 错误前保留的交互记录数 |
| **批量上报** | `sampling.reporting.batch.maxItems` | `number` | `10` | 单次最多上报条数 |
| | `sampling.reporting.batch.maxWaitMs` | `number` | `10000` | 最大等待时间（毫秒） |
| **即时上报类型** | `sampling.reporting.immediateTypes` | `string[]` | `["resource_error_core","page_crash","js_error_global"]` | 匹配即立即上报 |
| **卸载兜底** | `sampling.reporting.unloadBeaconEnabled` | `boolean` | `true` | 是否启用 `sendBeacon` |
| **本地限流** | `sampling.throttling.maxReportsPerHour` | `number` | `1000` | 每小时最大上报量 |
| **重复错误过滤** | `sampling.throttling.deduplicationEnabled` | `boolean` | `true` | 开启指纹去重 |
| **忽略错误** | `sampling.throttling.ignoreErrors` | `string[]` | `[]` | 正则字符串列表（前端需 `new RegExp()`） |
| **忽略 URL** | `sampling.throttling.ignoreUrls` | `string[]` | `[]` | 正则字符串列表 |
| **重试策略** | `sampling.retryAndCache.retryDelaysMs` | `number[]` | `[1000, 3000, 5000]` | 指数退避重试间隔（毫秒） |
| **离线缓存** | `sampling.retryAndCache.offlineCacheEnabled` | `boolean` | `true` | 是否用 IndexedDB 缓存失败数据 |
| **IP 脱敏** | `privacy.ipAnonymizationEnabled` | `boolean` | `true` | 如截断 IP 最后一段 |
| **用户 ID 加密** | `privacy.userIdEncryptionEnabled` | `boolean` | `true` | 对 `userId` 做哈希或 AES |
| **敏感字段** | `privacy.sensitiveFields` | `string[]` | `["password","token","secret","key"]` | 自动脱敏字段名 |
| **自定义脱敏** | `privacy.beforeSendHookEnabled` | `boolean` | `false` | 若为 `true`，调用用户注册的 `beforeSend` |


> 💡 **说明**：
>
> - 所有配置按 **应用（appId）维度** 管理；
> - 配置变更后 **实时生效**（通过长轮询或 WebSocket 推送）。

---

## 二、配置下发机制

### 1. **获取时机**

- SDK 初始化时，自动请求中台配置接口：
  ```
  GET /api/v1/sdk/config?appId=app-xxx&sdkVersion=1.2.0
  ```

### 2. **响应示例**

```json
{
  // 是否启用监控
  "enabled": true,

  // 采样配置
  "sampling": {
    // 用户行为回溯数量（错误发生前保留的交互记录条数）
    // 可选值：5, 10, 20；默认为 5
    "breadcrumbMaxCount": 5,
    
    "reporting": {
      "batch": {
        // 批量上报：单次最多合并多少条数据后触发上报
        "maxItems": 10,

        // 批量上报：最大等待时间（毫秒），超时即使未满 maxItems 也上报
        "maxWaitMs": 10000
      },

      // 即时上报类型：匹配这些类型的错误将跳过批量队列，立即上报
      // 默认包含核心资源错误、页面崩溃、全局 JS 错误
      "immediateTypes": [
        "resource_error_core",
        "page_crash",
        "js_error_global"
      ],

      // 是否在页面卸载（beforeunload/unload）时通过 navigator.sendBeacon() 上报缓存数据
      // 开启可提升离线/快速关闭场景的数据完整性
      "unloadBeaconEnabled": true
    },

    "throttling": {
      // 本地限流：每小时最多允许上报的错误条数（防止异常刷屏）
      "maxReportsPerHour": 1000,

      // 是否开启重复错误过滤（基于错误指纹去重）
      "deduplicationEnabled": true,

      // 忽略的错误消息（支持正则表达式字符串，前端需 new RegExp()）
      // 注意：JSON 中反斜杠需转义，所以 "\\." 表示正则中的 "\."
      "ignoreErrors": [
        "ResizeObserver loop limit exceeded",  // 常见浏览器警告
        "Script error\\.",                      // 跨域脚本错误
        "Network Error"                         // 网络请求失败（可选）
      ],

      // 忽略的 URL（正则字符串），匹配的页面错误不上报
      "ignoreUrls": [
        "https://thirdparty\\.com/.*",          // 第三方域名
        ".*\\/health-check$"                    // 健康检查路径
      ]
    },

    "retryAndCache": {
      // 失败重试策略：指数退避的重试间隔（单位：毫秒）
      // 第一次失败等 1s，第二次 3s，第三次 5s，之后不再重试
      "retryDelaysMs": [1000, 3000, 5000],

      // 是否启用离线缓存（使用 IndexedDB 存储失败数据，网络恢复后重试）
      "offlineCacheEnabled": true
    }
  },

  "privacy": {
    // 是否对 IP 地址脱敏（如 192.168.1.100 → 192.168.1.0）
    "ipAnonymizationEnabled": true,

    // 是否对用户标识（userId）进行加密或哈希处理，避免明文传输
    "userIdEncryptionEnabled": true,

    // 敏感字段列表：自动将 payload 中这些字段的值替换为 "***"
    // 支持嵌套路径（如 "user.password"）需 SDK 支持深度遍历
    "sensitiveFields": ["password", "token", "secret", "key"],

    // 是否启用自定义脱敏钩子（beforeSend）
    // 若为 true，SDK 会调用用户注册的 beforeSend(event) 函数做进一步处理
    "beforeSendHookEnabled": false
  }
}
```

### 3. **更新机制**

- **主动拉取**：每 `ttl` 秒轮询一次（默认 300s）
- **被动推送（可选）**：通过 WebSocket 或 SSE 实时通知配置变更

---

## 三、SDK 端配置合并逻辑

SDK 启动时，按以下优先级合并配置：

```ts
finalConfig = merge(
  defaultConfig, // SDK 内置默认值
  remoteConfig, // 中台下发配置（高优先级）
  userInitOptions // 用户 init() 传入配置（最高优先级）
)
```

### 📌 优先级规则（从高到低）：

1. **用户代码显式传入**（如 `Sentinel.init({ report: { batchSize: 5 } })`）
2. **中台远程配置**
3. **SDK 内置默认值**

> ✅ 举例：
>
> - 中台设 `batchSize=20`，用户 init 传 `batchSize=5` → 最终用 `5`
> - 中台关闭 `enabled=false`，但用户 init 未传 → SDK 不工作
> - 用户 init 未传 `breadcrumb.maxCount`，中台设为 `10` → 用 `10`

---

## 四、安全与合规约束

| 风险点                            | 控制措施                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **`customRedactFn` 执行任意代码** | - 仅允许在 **可信内网环境** 开启<br>- 生产环境默认禁用<br>- 若开启，需对函数体做沙箱校验（如只允许正则替换） |
| **配置被篡改**                    | - 配置接口走 HTTPS + JWT 鉴权<br>- 响应体签名验证（可选）                                                    |
| **隐私字段泄露**                  | - 敏感字段自动脱敏（即使用户未配 `beforeSend`）<br>- IP 脱敏默认开启                                         |
| **过度采集**                      | - 中台可强制限制 `breadcrumb.maxCount ≤ 30`<br>- 强制开启 `dedup`                                            |

---

## 五、中台管理界面建议（UI 层）

在 Sentinel 中台的 **“应用设置 > SDK 配置”** 页面，提供：

- ✅ 开关：启用/禁用监控
- ✅ 下拉选择：行为回溯数量（5/10/20/30）
- ✅ 表单输入：批量阈值、时间间隔
- ✅ 多选框：即时上报类型（联动“错误类型定义”）
- ✅ 开关组：限流、去重、离线缓存
- ✅ 文本域：正则忽略列表（带语法提示）
- ✅ 隐私面板：
  - IP 脱敏开关
  - 敏感字段输入框（逗号分隔）
  - 自定义脱敏函数编辑器（带安全警告）

---

## 六、后续演进建议

1. **配置版本管理**：记录每次变更，支持回滚
2. **A/B 测试**：对不同用户群下发不同采样率
3. **性能影响监控**：中台展示“SDK 配置变更 vs 页面性能指标”关联分析
4. **合规审计日志**：谁在何时修改了隐私配置？

---

是否需要我提供：

- **中台配置 API 的 OpenAPI/Swagger 定义**？
- **SDK 端配置合并的 TypeScript 实现代码**？
- **敏感字段自动脱敏的正则匹配逻辑示例**？

请告诉我你的下一步重点。

# 更新配置机制，直接在每次初始化的时候获取会有什么问题？

这是一个非常关键的问题！**在每次 SDK 初始化时都去请求中台获取最新配置（即“冷启动拉取”）**，看似简单直接，但在实际生产环境中会带来一系列严重问题。以下是详细分析：

---

## ❌ 问题一：**显著增加页面首屏加载耗时（破坏性能无损原则）**

### 场景：

- 用户打开页面 → 加载业务 JS → 初始化 Sentinel SDK → **发起 HTTP 请求拉取配置** → 等待响应 → 开始采集

### 后果：

- **阻塞监控初始化**：SDK 必须等配置返回后才能决定是否开启、如何采样。
- **增加关键路径延迟**：即使配置接口很快（100ms），也会让 SDK 生效延迟，可能错过早期错误（如框架初始化错误）。
- **违反“性能无损 ≤5ms”承诺**：一次额外网络请求远超 5ms。

> 📉 实测数据：在 3G 网络下，一次 HTTPS 请求平均耗时 300~800ms。

---

## ❌ 问题二：**无法捕获“初始化阶段”的致命错误**

### 典型场景：

```js
// index.html
<script src="sentinel.js"></script>
<script>
  // 此时 SDK 还未拿到配置，处于“等待中”状态
  throw new Error('Framework init failed!'); // ← 此错误可能丢失！
</script>
```

- 如果 SDK 在拿到远程配置前不开始监听 `window.onerror`，**早期 JS 错误将完全漏报**。
- 而这些错误恰恰是最关键的（如白屏、框架挂掉）。

---

## ❌ 问题三：**放大失败面，降低系统可靠性**

- 若中台配置服务宕机、超时或返回错误：
  - SDK 是“等待配置”还是“使用默认值”？
    - 若等待 → 监控完全失效；
    - 若降级 → 配置不一致，运维困惑。
- 增加对中台服务的强依赖，违背“前端 SDK 应尽量自治”原则。

---

## ❌ 问题四：**浪费带宽与服务器资源**

- 每次页面访问都请求配置（PV 级别调用），而配置通常**数小时甚至数天才变更一次**。
- 对于高流量应用（日活百万+），这将产生：
  - 巨量无效请求
  - 中台配置服务成为瓶颈
  - CDN/负载均衡压力陡增

> 💡 举例：100 万 PV/天 → 每秒约 12 次配置请求，纯属浪费。

---

## ✅ 正确做法：**“本地缓存 + 异步更新”策略**

### 推荐方案：

| 阶段                      | 行为                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------- |
| **1. 首次加载（无缓存）** | 使用 **内置默认配置** 立即启动监控 → **同时异步拉取远程配置** → 拉取成功后缓存并热更新  |
| **2. 后续加载（有缓存）** | 从 `localStorage` / `sessionStorage` 读取上次有效配置 → 立即启动 → **后台静默刷新配置** |
| **3. 配置变更检测**       | 每 `TTL`（如 5 分钟）轮询一次，或通过 WebSocket/SSE 推送                                |

推荐方案：“启动时拉取 + 本地缓存 + 刷新生效”，不需要做配置变更检测

### 优势：

- ✅ **零延迟启动**：不阻塞 SDK 初始化，不错过早期错误
- ✅ **弱依赖中台**：即使配置服务挂了，也能用缓存或默认配置工作
- ✅ **节省资源**：配置请求频率降至 `用户数 × (1/TTL)`，而非 `PV 数`
- ✅ **平滑升级**：支持运行时动态调整采样率、开关等

---

## 🔧 技术实现示意（伪代码）

```ts
async function init(userOptions) {
  // Step 1: 立即合并默认配置 + 用户传参，启动基础监控
  const baseConfig = merge(defaultConfig, userOptions)
  startMonitoring(baseConfig)

  // Step 2: 异步获取远程配置（不阻塞）
  try {
    const cached = getFromStorage('sentinel_config')
    if (cached && !isExpired(cached)) {
      applyConfig(cached) // 热更新
    }

    // 后台拉取最新配置
    const remoteConfig = await fetchConfigWithTimeout(2000)
    saveToStorage(remoteConfig)
    applyConfig(remoteConfig) // 动态生效
  } catch (err) {
    // 静默失败，不影响主逻辑
    logDebug('Failed to load remote config', err)
  }
}
```

> ⚠️ 注意：`applyConfig()` 需支持运行时更新插件参数（如调整 `breadcrumb.maxCount`）。

---

## 📌 总结：为什么不能“每次初始化都拉配置”？

| 维度       | 问题                               |
| ---------- | ---------------------------------- |
| **性能**   | 增加首屏延迟，违反 ≤5ms 承诺       |
| **可靠性** | 可能丢失早期错误，强依赖中台可用性 |
| **资源**   | 浪费带宽，压垮配置服务             |
| **体验**   | 用户感知卡顿（尤其弱网）           |

✅ **正确姿势**：**先跑起来，再优化** —— 用缓存/默认值保证立即可用，异步更新保证长期准确。

---

如需，我可以提供：

- 完整的 **配置缓存 + 热更新 TypeScript 实现**
- **配置版本号比对** 机制（避免重复应用相同配置）
- **灰度配置** 的客户端处理逻辑

是否需要？
