const { aiMediaManager } = require('./src')
const { safeRun } = require('./src/utils')

safeRun(() => aiMediaManager(process.argv))
