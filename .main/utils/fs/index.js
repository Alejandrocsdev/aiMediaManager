const fs = require('fs')
const path = require('path')

// 確保資料夾存在
const ensureDir = dir => !fs.existsSync(dir) && fs.mkdirSync(dir)

// 取得指定資料夾中符合副檔名的所有檔案路徑
const getFilePaths = (dir, ext, command) => {
  let paths = []

  const files = fs.readdirSync(dir, { withFileTypes: true })

  const index = Number(command)
  if (!Number.isInteger(index)) throw new Error(`❌ 無效的檔案索引: "${command}"`)

  const file = files[index]
  if (!file) throw new Error(`❌ 找不到索引 ${index} 對應的 ${ext} 檔案`)

  const filePath = path.join(dir, file.name)

  if (file.isFile() && file.name.endsWith(ext)) {
    paths.push(filePath)
  }

  return paths
}

module.exports = { ensureDir, getFilePaths }
