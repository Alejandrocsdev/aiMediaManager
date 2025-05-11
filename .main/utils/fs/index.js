const fs = require('fs')
const path = require('path')

// 讀取 JSON 檔並解析成物件
const loadJson = path => JSON.parse(fs.readFileSync(path, 'utf8'))

// 確保資料夾存在
const ensureDirs = dirs => dirs.forEach(dir => !fs.existsSync(dir) && fs.mkdirSync(dir))

// 取得指定資料夾中符合副檔名的所有檔案路徑
const getFilePaths = (dir, ext, command) => {
  let paths = []

  const files = fs.readdirSync(dir, { withFileTypes: true })

  const matchFiles = entry => {
    const filePath = path.join(dir, entry.name)

    if (entry.isFile() && entry.name.endsWith(ext)) {
      paths.push(filePath)
    }
  }

  if (command === 'all' || command === 'list') {
    files.forEach(entry => matchFiles(entry))
  } else {
    const index = Number(command)
    if (!Number.isInteger(index)) throw new Error(`❌ 無效的檔案索引: "${command}"`)

    const file = files[index]
    if (!file) throw new Error(`❌ 找不到索引 ${index} 對應的 ${ext} 檔案`)

    matchFiles(file)
  }

  if (paths.length === 0) throw new Error(`缺少 ${ext} 檔`)

  return paths
}

module.exports = { loadJson, ensureDirs, getFilePaths }
