
// create two dimensional array matrix - where each field contains a given default object 
const createObjectMatrix = (rows, cols, defaultObject) => {
  let arr = new Array(rows)
  arr.fill(new Array(cols).fill(''))
  return arr.map((row, rowIndex) => row.map((item, colIndex) => ({
    ...defaultObject, row: rowIndex, col: colIndex
  })))
}

export default createObjectMatrix