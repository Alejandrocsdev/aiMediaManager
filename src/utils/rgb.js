const rgb = color => {
  const rgbObj = (r, g, b) => {
    return { r, g, b }
  }
  switch (color) {
    case 'black':
      return rgbObj(0, 0, 0)
    case 'white':
      return rgbObj(255, 255, 255)
    case 'yellow':
      return rgbObj(255, 255, 0)
    case 'red':
      return rgbObj(255, 0, 0)
    case 'green':
      return rgbObj(0, 255, 0)
    case 'blue':
      return rgbObj(0, 0, 255)
    default:
      throw new Error(`❌ No such color: ${color}`)
  }
}

module.exports = rgb
