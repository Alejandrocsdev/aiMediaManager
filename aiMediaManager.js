const path = require('path')

const { aiMediaManager } = require('./.main')
const { safeRun } = require('./.main/utils')

safeRun(() => aiMediaManager(path.resolve('db', 'line.db')))
