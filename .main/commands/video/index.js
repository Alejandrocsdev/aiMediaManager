const path = require('path')

// 自訂工具函式
const { ensureDirs, loadJson, getFilePaths, logList } = require('../../utils')

// 定義資料夾路徑
const videoDir = path.resolve('video')

// 確保資料夾存在
ensureDirs([videoDir])

const video = command => {
  // 讀取設定檔
  const config = loadJson(path.resolve('config.json'))

  // 影片副檔名
  const videoType = `.${config.video_type}`

  if (command === 'list') {
    const videoFiles = getFilePaths(videoDir, videoType, command)
    logList(videoFiles)
  }
}

module.exports = video
