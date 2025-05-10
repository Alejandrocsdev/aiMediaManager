const { spawn } = require('child_process')
const path = require('path')

const aiMediaDir = path.resolve('.aiMediaConnector')
const aiMediaPath = path.join(aiMediaDir, 'aiMediaConnector')
const libPath = path.join(aiMediaDir, 'lib')

const spawnDetached = dbPath => {
  const connector = spawn(aiMediaPath, [path.relative(aiMediaDir, dbPath)], {
    // current working directory
    cwd: aiMediaDir,
    // 設定環境變數 LD_LIBRARY_PATH，讓 aiMediaConnector 能找到所需的 .so 動態連結庫
    env: { ...process.env, LD_LIBRARY_PATH: libPath },
    // true 表示讓這個子行程與父行程分離(背景執行)
    detached: true,
    // standard I/O: 'ignore' 表示不顯示子行程的輸出(標準輸出與錯誤)
    stdio: 'ignore'
  })

  // Unreference: 允許主程式執行完後自動結束，而不需等子行程
  connector.unref()

  // 監聽內建的 error 事件(啟動失敗時觸發)
  connector.on('error', error => {
    console.error('❌ aiMediaConnector 啟動失敗:', error.message)
  })

  return connector
}

module.exports = { spawnDetached }
