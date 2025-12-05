# 根据产品校验过的 excel , 更新项目国际化

## 需求

- 产品将校对后的 excel 发回。将 excel 和项目国际化文件对比，相同的 key，使用 excel 的值覆盖，输出新的国际化配置文件。

### 思路分析

1. 产品修改后返回 Excel 文件
   ↓
2. 读取 Excel，解析修改后的文案
   ↓
3. 对比原始 JSON，按 key 合并更新
   ↓
4. 写回新的国际化 JSON 文件

### 完整代码

```js
/**
 * 根据产品校验过的 excel , 更新项目国际化配置文件
 *
 * 1. 校队好的 excel 文件，列顺序必须要和以下配置 languageColumns 顺序对应：Key, zh-TW, en_US, ...
 * 2. /locales 项目所有国际化配置 .json 文件
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

// =======================
// 🔧 配置区（可外部抽离为 config.json 或 .env）
// =======================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  // Excel 文件路径
  excelFile: path.resolve(__dirname, '2025-09-09_ME学堂国际化.xlsx'),

  // 国际化文件目录
  localesDir: path.resolve(__dirname, 'locales'),

  // Excel 第一行为表头时，按顺序定义语言字段名（对应 JSON 文件名）
  // Excel 列顺序：Key, zh-TW, ...
  languageColumns: [
    'zh-TW', // Excel 第2列
    'en_US', // 第3列
    'th_TH', // 第4列
    'pt_PT', // 第5列
    'ko_KR', // 第6列
    'tr_TR', // 第7列
    'vi_VN', // 第8列
    'es_ES' // 第9列
  ],

  // 可选：自定义 JSON 文件名映射（如果文件命名不规范可调整）
  // 默认: langCode => langCode.replace('-', '_') + '.json'
  // 例如: 'zh-TW' -> 'zh_TW.json'，如果你的文件是 zh-TW.json，则无需映射
  fileMapping: {
    'zh-TW': 'zh-TW.json',
    en_US: 'en_US.json',
    th_TH: 'th_TH.json',
    pt_PT: 'pt_PT.json',
    ko_KR: 'ko_KR.json',
    tr_TR: 'tr_TR.json',
    vi_VN: 'vi_VN.json',
    es_ES: 'es_ES.json'
  }
}

// =======================
// 读取 Excel 数据
// =======================
async function readExcelData(filePath) {
  try {
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
    const rows = data.length > 1 ? data.slice(1) : []
    console.log(`✅ 成功读取 Excel，共 ${rows.length} 行数据`)
    return rows
  } catch (err) {
    console.error('❌ 读取 Excel 文件失败:', err.message)
    process.exit(1)
  }
}

// =======================
// 构建翻译映射表
// =======================
function buildTranslationMap(excelData, languageColumns) {
  const map = {}

  excelData.forEach(row => {
    const key = row[0] // 第一列是 key
    if (!key) return

    const translations = {}
    languageColumns.forEach((langCode, index) => {
      const value = row[index + 1] // Excel 第2列开始对应 languageColumns
      translations[langCode] = String(value || key) // 空值 fallback 到 key
    })

    map[key] = translations
  })

  return map
}

// =======================
// 获取 JSON 文件路径
// =======================
function getJsonFilePath(langCode, baseDir, fileMapping) {
  // 优先使用自定义映射
  if (fileMapping[langCode]) {
    return path.join(baseDir, fileMapping[langCode])
  }
  // 默认规则：zh-TW -> zh_TW.json
  const filename = langCode.replace('-', '_') + '.json'
  return path.join(baseDir, filename)
}

// =======================
// 更新单个 JSON 文件
// =======================
async function updateJsonFile(filePath, langCode, translationMap) {
  try {
    const rawData = await fs.promises.readFile(filePath, 'utf8')
    const data = JSON.parse(rawData)

    let updated = false

    for (const key in data) {
      if (translationMap[key] && translationMap[key][langCode] !== undefined) {
        const newValue = translationMap[key][langCode]
        if (data[key] !== newValue) {
          data[key] = newValue
          updated = true
        }
      }
    }

    if (updated) {
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        'utf8'
      )
      console.log(`✅ 已更新: ${filePath}`)
    } else {
      console.log(`🔸 无需更新: ${filePath}`)
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`🟡 文件不存在，跳过: ${filePath}`)
    } else {
      console.error(`❌ 更新失败: ${filePath}`, err.message)
    }
  }
}

// =======================
// 主流程
// =======================
async function main() {
  console.log('🔄 开始更新国际化文件...')

  // 1. 读取 Excel
  const excelData = await readExcelData(config.excelFile)

  // 2. 构建翻译映射
  const translationMap = buildTranslationMap(excelData, config.languageColumns)

  // 3. 批量更新每个语言文件
  for (const langCode of config.languageColumns) {
    const filePath = getJsonFilePath(
      langCode,
      config.localesDir,
      config.fileMapping
    )
    await updateJsonFile(filePath, langCode, translationMap)
  }

  console.log('🎉 国际化文件更新完成！')
}

// 执行
main().catch(console.error)
```
