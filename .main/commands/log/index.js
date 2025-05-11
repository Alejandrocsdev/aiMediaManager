const path = require('path')

// 自訂工具函式
const { ensureDirs, getFilePaths, logList } = require('../../utils')

// 定義資料夾路徑
const videoDir = path.resolve('video')

// 確保資料夾存在
ensureDirs([videoDir])

const log = command => {
  if (command === 'list') {
    const logFiles = getFilePaths(videoDir, '.log', command)
    logList(logFiles)
  }
}

module.exports = log
