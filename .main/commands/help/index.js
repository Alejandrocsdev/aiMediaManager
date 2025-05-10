const fs = require('fs')
const path = require('path')

const helpPath = path.join(__dirname, 'help.txt')
const helpContent = fs.readFileSync(helpPath, 'utf8')

const help = () => console.info(helpContent)

module.exports = help
