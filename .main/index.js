const { spawnDetached } = require('./utils')

const aiMediaManager = dbPath => spawnDetached(dbPath)

module.exports = { aiMediaManager }
