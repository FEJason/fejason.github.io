# 前端实现 Mock API

下面给你一套 **从零开始** 的完整教程：
从 **安装 MySQL → 安装可视化工具 → 创建表结构 → Node.js 连接 → 完整两个接口**。

我会带你一步步从完全没环境，到接口能跑。

---

# 一、安装 MySQL（Windows）

## **下载 MySQL Community Server（免费版）**

下载地址（MySQL 官方）：
[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

选择版本：
**MySQL Community Server 8.x**（推荐）

安装步骤（简化版）：

1. 选择 **Server Only** 或 **Developer Default**
2. 设置 root 密码（Aa123456）
3. 安装完毕

---

# 二、安装可视化工具（推荐 Navicat）

## **1️⃣ 下载 Navicat Premium / Navicat for MySQL**

官方下载：
[https://www.navicat.com/en/download/navicat-premium](https://www.navicat.com/en/download/navicat-premium)

安装完成后，你可以用它：

- 创建数据库
- 创建表
- 可视化增删改查
- 导入导出数据
- 测试 SQL

---

# 三、在 Navicat Premium 中创建数据库

打开 Navicat → 连接 → MySQL：

```
连接名：本地
Host：127.0.0.1
Port：3306
User：root
Password：（你安装时设置的密码）
```

连接成功以后：

右键连接 → **新建数据库**：
数据库名：`transaction_db`

---

# 四、创建两张数据表（在 Navicat 执行 SQL）

你需要两张表：

### 1️⃣ **记录表：transaction_records**

用于存储每一条交易明细

### 2️⃣ **月份表（可选）：不存在也没关系**

因为我们可以从 `created_at` 自动按月查询，不需要额外表

---

## 执行以下 SQL 创建表

在 Navicat → 选择你的数据库 → 运行 SQL（闪电图标）

```sql
CREATE TABLE `transaction_records` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `amount` DECIMAL(20, 6) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL
);
```

数据示例（可直接在 Navicat 可视化输入）：

| id  | amount | type     | created_at          | description |
| --- | ------ | -------- | ------------------- | ----------- |
| 1   | 100    | deposit  | 2025-02-03 12:00:00 | 充值        |
| 2   | -50    | withdraw | 2025-02-10 10:00:00 | 提现        |
| 3   | -30    | withdraw | 2025-03-01 09:00:00 | 提现        |

---

# 五、Node.js 项目环境搭建

在你的项目目录运行：

```bash
mkdir server
cd server
npm init -y
npm install express mysql2 cors
```

---

# 六、创建 MySQL 连接（db.js）

创建文件：`db.js`

```js
import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '你的密码',
  database: 'transaction_db'
})
```

---

# 七、创建 Express 服务器（index.js）

```js
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

// 启动服务
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001')
})
```

---

# 八、实现两个接口

你的需求：

1. **接口 ①：根据月份获取交易记录（分页）**
2. **接口 ②：获取有数据的月份列表**

---

# ### **接口 ①：按月份分页查询**

```
GET /transactions?month=2025-03&page=1&pageSize=10
```

新增到 index.js：

```js
// ① 按月份分页查询
app.get('/transactions', async (req, res) => {
  const { month, page = 1, pageSize = 10 } = req.query

  if (!month) {
    return res.status(400).json({ message: 'month 参数必填，如 2025-03' })
  }

  const start = `${month}-01 00:00:00`
  const end = `${month}-31 23:59:59` // 简单处理，够用

  const offset = (page - 1) * pageSize

  try {
    const [rows] = await pool.query(
      `SELECT * FROM transaction_records
       WHERE created_at BETWEEN ? AND ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [start, end, Number(pageSize), offset]
    )

    // 查询总数
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM transaction_records
       WHERE created_at BETWEEN ? AND ?`,
      [start, end]
    )

    res.json({
      list: rows,
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      hasMore: page * pageSize < total
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})
```

---

# ### **接口 ②：获取有记录的月份列表**

```
GET /months
```

例如返回：

```json
["2025-03", "2025-02"]
```

新增到 index.js：

```js
// ② 获取有记录的月份列表
app.get('/months', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month
      FROM transaction_records
      GROUP BY month
      ORDER BY month DESC
    `)

    res.json(rows.map(r => r.month))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '服务器错误' })
  }
})
```

---

# 九、运行服务

运行：

```bash
node index.js
```

API 测试：

- [http://localhost:3001/months](http://localhost:3001/months)
- [http://localhost:3001/transactions?month=2025-02&page=1&pageSize=10](http://localhost:3001/transactions?month=2025-02&page=1&pageSize=10)

---

# 到这里为止……

你已经完成：

✔ MySQL 安装
✔ Navicat 安装
✔ 创建数据库
✔ 创建数据表
✔ Node.js 连接 MySQL
✔ 两个完整接口（分页 + 月份分组）
✔ 可直接接入前端 React/Vue

---

# 扩展

🔧 补充 Docker + 部署方案
🔧 加上 token 权限验证
🔧 加上 create / update / delete 数据
