const { aiMediaManager } = require('./.main')
const { safeRun } = require('./.main/utils')

safeRun(() => aiMediaManager(process.argv))
