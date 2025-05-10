const path = require('path')

// 自訂工具函式
const { spawnDetached } = require('../../utils')

// 定義資料夾路徑
const dbDir = path.resolve('db')

const run = () => {
  console.log('🚀 Running aiMediaConnector')

  spawnDetached(path.join(dbDir, 'line.db'))
}

module.exports = run
