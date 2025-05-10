const safeRun = fn => {
  try {
    fn()
  } catch (error) {
    console.error(`${error.name}: ${error.message}`)
  }
}

module.exports = { safeRun }
