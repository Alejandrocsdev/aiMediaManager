const { aiMediaManager } = require('./.main')
const { safeRun } = require('./.main/utils')

const command = process.argv[2]

safeRun(() => aiMediaManager(command))
