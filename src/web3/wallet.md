# Web3学习建议路线（Web 前端视角）

- 先学基础概念：钱包、私钥、Gas、RPC、ABI、合约地址。
- 用 ethers.js 连接钱包并读取链上数据（如 ETH 余额）。
- 调用一个简单合约函数（如 ERC-20 的 balanceOf）。
- 使用 RainbowKit + Wagmi 重构为 Vue 应用。
- 进阶：监听事件、发送交易、处理错误、多链支持。
- 部署测试：使用 Sepolia 测试网 + Alchemy/Infura 节点。

## 基础概念

### 钱包

**是什么？**

一个管理你区块链账户的工具，不是存储加密货币的地方（币其实“在链上”），而是帮你：

- 保管私钥（或助记词）
- 签名交易（证明“你是你”）
- 与 Dapp 交互（如 MetaMask，送交易、查询数据）

#### 常见钱包

- 浏览器插件：MetaMask、Phantom、WalletConnect、Coinbase Wallet
- 手机 APP: Trust Wallet, Rainbow
- 前端集成库： RainbowKit、Web3Modal

### 私钥

**是什么？**

一串64位十六进制字符（如 0x1234...def），完全控制一个区块链账号。

- 谁有私钥 = 谁能花这个地址的钱
- 绝对不能泄露！一旦泄露，资产可被立即转走
- 私钥 ->（通过椭圆曲线算法）-> 公钥 -> （Keccak256 + 截取）-> 地址（0x...）

> 重要：前端代码中绝对不能出现私钥！用户私钥只存在于其本地钱包中。

---

### Gas

**是什么？**

执行区块链操作（转账、调用合约）所需的“燃料费”，以ETH（或其他链原生代币）支付。

- 为什么需要？防止网络被垃圾请求堵塞
- Gas 费 = Gas Price（单价） * Gas Limit（用量）
  - 例如：发送 ETH 约需 21,000 gas
  - 调用复杂合约可能需要 100,000+ gas

> 前端需注意：
> - 用户发起交易时，钱包会预估 Gas 并显示
> - 你可以通过 `ethers.provider.getGasPrice()` 获取当前 Gas 价格（用于提示用户）

---

### RPC（Remote Procedure Call）节点

**是什么？**

你的前端与区块链之间的“桥梁”。区块链数据不直接连浏览器，而是通过 **RPC 节点** 查询和发送请求。

**常见RPC服务商**
- [Infura](https://infura.io/)
- [Alchemy](https://www.alchemy.com/)
- [QuickNode](https://www.quicknode.com/)
- 公共节点（如 `https://rpc.sepolia.org`）

**前端如何使用？**
```ts
// 使用 Alchemy 的 Sepolia 节点
const provider = new ethers.providers.JsonRpcProvider(
  'https://eth-sepolia.g.alchemy.com/v2/<YOUR_API_KEY>'
);
```

> 当前用户安装 MetaMask时，它**自带 RPC 连接**（所以 `new ethers.BrowserProvider(window.ethereum)` 可直接用）。但如果你要做“只读”功能（如展示 NFT），建议用自己的 RPC 节点（更稳定、可监控）。

---

### ABI（Application Binary Interface）
**是什么？**
智能合约的“API 文档”，告诉前端**如何调用合约函数**。

- 是一个 JSON 数组，描述合约的函数、事件、参数类型
- 编译 Solidity 合约时自动生成

**示例（ERC-20 的 ABI 片段）：**
```json
[
  {
    "constant": true,
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
]
```

**前端如何用？**
```ts
const contract = new web3.eth.Contract(
  "0x...",        // 合约地址
  abi,            // ABI 数组
  provider        // Provider 或 Signer
);

const balance = await contract.balanceOf("0xUser...");
```

> 没有 ABI？你就无法知道合约有哪些函数、怎么传参！

---

### 合约地址（Contract Address）
**是什么？**
智能合约部署到区块链后获得的**唯一地址**（格式如 `0xAbC...123`）

- 由部署者地址 + nonce 决定（不可预测）
- 一旦部署，代码**不可更改**（除非设计为可升级）
- 所有用户都通过这个地址与合约交互

> 如何获取？
> - 自己部署：Hardhat/Remix 会返回地址
> - 第三方合约：查 Etherscan （如 [Uniswap V2 Router](https://sepolia.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D)）

---

### 总结：前端如何串联这些概念？

假设你要做一个“查询用户 DAI 余额”的功能：

1. **用户打开网页** → 你检测 `window.ethereum`（钱包）
2. **用户点击“连接钱包”** → MetaMask 弹窗授权 → 返回用户地址
3. **你用合约地址 + ABI** 创建 DAI 合约实例
4. **通过 RPC 节点**（经由 MetaMask 或 Alchemy）调用 `balanceOf(用户地址)`
5. **节点返回结果** → 你展示给用户
6. **全程无需私钥**！签名由钱包在本地完成

---

### 推荐验证方式（动手加深理解）

1. 打开 [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. 搜索一个合约地址（如 DAI 测试地址：`0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa`）
3. 点击 “Contract” → “Code” → 查看 **Contract ABI**
4. 点击 “Read Contract” → 输入你的钱包地址 → 查看 `balanceOf` 结果
5. 对比你前端代码的输出是否一致 

---

## 用 ethers.js 读取 ETH 余额，把理论变成代码！

> 目标：点击“连接钱包按钮” -> 弹出 MetaMask -> 获取用户地址和余额（ETH/tBNB）-> 显示在页面上
> 技术栈：Vite + Vue 3 + ethers.js

---

### 前提条件

1. 安装 [MetaMask](https://metamask.io/) 浏览器插件  
2. 安装 Node.js（v18+）
3. 选择测试网：
   - **Sepolia（ETH）**：水龙头 → https://sepoliafaucet.com/
   - **BSC Testnet（tBNB）**：水龙头 → https://testnet.bnbchain.org/faucet-smart

---

### 第 1 步：创建 Vite + Vue 3 项目

```bash
npm create vite@latest web3-vue-wallet -- --template vue-ts
cd web3-vue-wallet
npm install
```

---

### 第 2 步：安装 ethers.js

```bash
npm install ethers
```

> 注意：ethers.js v6+ 原生支持 ESM，与 Vite 完全兼容。

---

### 第 3 步：编写 Vue 组件（替换 `src/App.vue`）

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ethers } from 'ethers'

// 响应式状态
const account = ref<string | null>(null)
const balance = ref<string | null>(null)
const symbol = ref<string>('')
const error = ref<string | null>(null)
const loading = ref<boolean>(false)

// 根据 chainId 返回对应代币符号
const getChainSymbol = (chainId: bigint): string => {
  switch (chainId) {
    case 11155111n: return 'SepoliaETH' // Sepolia
    case 97n: return 'tBNB'            // BSC Testnet
    case 1n: return 'ETH'
    case 56n: return 'BNB'
    default: return 'ETH'
  }
}

// 连接钱包
const connectWallet = async () => {
  // 检查 MetaMask 是否安装
  if (typeof window.ethereum === 'undefined') {
    error.value = 'Please install MetaMask!'
    return
  }
  loading.value = true
  error.value = null
  try {
    // 获取用户账户
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    account.value = accounts[0]

    // 创建一个提供者，获取网络信息、账户余额等信息
    const provider = new ethers.BrowserProvider(window.ethereum)
    balance.value = ethers.formatEther(await provider.getBalance(accounts[0]))
    symbol.value = getChainSymbol((await provider.getNetwork()).chainId)
  } catch (err: any) {
    error.value = `操作被拒绝或失败：${err.message}`
  } finally {
    loading.value = false
  }
}

// 断开连接：撤销 MetaMask 授权并清空状态
const disconnectWallet = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      })
    }
  } catch (_) {}
  account.value = null
  balance.value = null
  symbol.value = 'BNB'
  error.value = null
  loading.value = false
}

// 监听钱包切换账号/网络，自动刷新
onMounted(() => {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', () => window.location.reload())
    window.ethereum.on('chainChanged', () => window.location.reload())
  }
})
</script>

<template>
  <div style="padding: 2rem; font-family: Arial, sans-serif; max-width: 600px;">
    <h3>🔐 Web3 钱包连接示例 (Vue 3)</h3>
    <p>支持 Sepolia（ETH）或 BSC Testnet（tBNB）</p>

    <button
      v-if="!account"
      @click="connectWallet"
      :disabled="loading"
      style="padding: 0.75rem 1.5rem; font-size: 1rem; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer;"
    >
      {{ loading ? '连接中...' : '连接钱包（MetaMask）' }}
    </button>

    <div v-else style="margin-top: 1.5rem;">
      <p>✅ 已连接到钱包</p>
      <p><strong>地址:</strong></p>
      <p style="word-break: break-all; background-color: #f5f5f5; padding: 0.5rem;">
        {{ account }}
      </p>
      <p><strong>余额:</strong> {{ balance }} {{ symbol }}</p>
      <button @click="connectWallet" style="margin-top: 1rem; padding: 0.5rem 1rem;">重新连接</button>
      <button @click="disconnectWallet" style="margin-top: 1rem; margin-left: 0.5rem; padding: 0.5rem 1rem; background-color: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">断开连接</button>
    </div>

    <p v-if="error" style="color: red; margin-top: 1rem;">{{ error }}</p>

    <div style="margin-top: 2rem; font-size: 0.9rem; color: #666;">
      <h3>📌 使用说明：</h3>
      <ul>
        <li>1. 在 MetaMask 中切换到 <strong>Sepolia</strong> 或 <strong>BSC Testnet</strong></li>
        <li>2. 领取测试币：
          <ul>
            <li><a href="https://sepoliafaucet.com/" target="_blank">Sepolia ETH 水龙头</a></li>
            <li><a href="https://testnet.bnbchain.org/faucet-smart" target="_blank">BSC tBNB 水龙头</a></li>
          </ul>
        </li>
        <li>3. 点击"连接钱包"即可查看余额</li>
      </ul>
    </div>
  </div>
</template>

```

### 第 4 步：启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`（端口可能不同）。

---

### 第 5 步：测试流程

### 方案 A：Sepolia（ETH）
1. MetaMask → 切换到 **Sepolia Testnet**
2. 访问 https://sepoliafaucet.com/ → 领取 ETH
3. 点击“连接钱包” → 查看余额

### 方案 B：BSC Testnet（tBNB）
1. MetaMask → 添加网络（Chain ID: `97`，RPC: `https://data-seed-prebsc-1-s1.binance.org:8545`）
2. 访问 https://testnet.bnbchain.org/faucet-smart → 领取 tBNB
3. 点击“连接钱包” → 查看 tBNB 余额

---

### 成功效果

你将看到类似：

```
✅ 已连接到钱包
地址: 0x742d...123f
余额: 0.5 tBNB
```

---

### 安全 & 兼容性说明

- 使用 `ethers.BrowserProvider`（v6 推荐方式）
- 自动识别当前链并显示正确代币符号
- 账户/网络切换时自动刷新（简化处理）
- **不存储、不传输私钥**，完全依赖 MetaMask

---

## 调用一个简单合约函数（如 ERC-20 的 balanceOf）
