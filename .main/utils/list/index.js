const path = require('path')

const logList = (files) => {
  const maxDigits = String(files.length - 1).length

  files.forEach((filePath, index) => {
    const paddedIndex = Number(String(index).padStart(maxDigits, ' '))
    const fileName = path.basename(filePath)
    console.log('index:', paddedIndex, `| ${fileName}`)
  })
}

module.exports = { logList }
