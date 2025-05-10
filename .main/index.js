const commands = require('./commands')

const aiMediaManager = command => commands(command)

module.exports = { aiMediaManager }
