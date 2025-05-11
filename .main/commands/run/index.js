const path = require('path')

// 自訂工具函式
const { ensureDirs, getFilePaths, spawnDetached } = require('../../utils')

// 定義資料夾路徑
const dbDir = path.resolve('db')

// 確保資料夾存在
ensureDirs([dbDir])

const run = (command = 0) => {
  console.log('🚀 執行 aiMediaConnector')

  // db 設定檔路徑
  const dbFiles = getFilePaths(dbDir, '.db', command)
  if (dbFiles.length === 0) throw new Error('缺少 .db 設定檔')

  const dbPath = dbFiles[0]

  const connector = spawnDetached(dbPath)

  console.log('PID:', connector.pid)
}

module.exports = run
