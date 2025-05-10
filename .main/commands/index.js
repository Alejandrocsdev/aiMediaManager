const run = require('./run')

const commands = async command => {
  try {
    switch (command) {
      case 'run':
        return run()
    }

    throw new Error(`❌ Unknown or malformed command: "${command}"`)
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = commands
