const fs = require('fs')
const path = require('path')

// 自訂工具函式
const { ensureDirs, loadJson, getFilePaths } = require('../../utils')

// 定義資料夾路徑
const dbDir = path.resolve('db')
const videoDir = path.resolve('video')

// 確保資料夾存在
ensureDirs([dbDir, videoDir])

const db = command => {
  // 讀取模板
  const mainTemplate = loadJson(path.resolve('.main', 'template', 'main.json'))
  const lineTemplate = loadJson(path.resolve('.main', 'template', 'algorithm', 'line.json'))

  // 讀取設定檔
  const config = loadJson(path.resolve('config.json'))

  // 影片副檔名
  const videoType = `.${config.video_type}`

  // 影片路徑
  const videoFiles = getFilePaths(videoDir, videoType, command)
  if (videoFiles.length === 0) throw new Error(`缺少 ${videoType} 影片檔`)

  // 記錄此次執行實際產生的 db 檔案數量
  let dbCount = 0

  // 遍歷每支影片
  videoFiles.forEach(videoPath => {
    // 根據影片檔名產生對應的 db 檔案名稱
    const fileName = path.basename(videoPath, videoType) + '.db'
    const dbPath = path.join(dbDir, fileName)

    // 拷貝 main 模板
    const db = structuredClone(mainTemplate)

    // 指定影片路徑
    db.video_source.source_info = videoPath
    // 套用顯示畫面
    db.show_video.show = config.show_video
    // 套用 log 設定
    db.video_source.enable_log = config.enable_log

    // 宣告跨線陣列
    const algorithm = db.video_source.algorithm
    algorithm.cross_line = []
    const crossLines = algorithm.cross_line

    // 取得 cross_line 陣列
    config.cross_line.forEach(line => {
      // 拷貝 line 模板
      const crossLine = structuredClone(lineTemplate)

      // 套用起點與終點
      crossLine.line_start = line.line_start
      crossLine.line_end = line.line_end

      // 加入 cross_line 陣列
      crossLines.push(crossLine)
    })

    // 生成 db 設定檔
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
    dbCount++
    const basename = path.basename(dbPath)
    console.log(`✅ 生成 ${basename} 設定檔`)
  })

  console.log(`📦 共生成 ${dbCount} 個 .db 設定檔`)
}

module.exports = db
