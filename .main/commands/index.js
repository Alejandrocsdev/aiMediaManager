const help = require('./help')
const run = require('./run')
const db = require('./db')
const video = require('./video')
const log = require('./log')

const commands = async argv => {
  try {
    const args = argv.slice(3)
    if (args.length > 0) {
      throw new Error(`❌ 無效的多餘參數: "${args.join(' ')}"`)
    }

    const command = argv[2]

    if (!command) {
      throw new Error('❌ 缺少指令')
    }

    switch (command) {
      case 'help':
        return help()
      case 'run':
        return run()
      case 'db:list':
        return db('list')
      case 'db:all':
        return db('all')
      case 'video:list':
        return video('list')
      case 'log:list':
        return log('list')
    }

    throw new Error(`❌ 不支援或格式錯誤的指令: "${command}"`)
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = commands
