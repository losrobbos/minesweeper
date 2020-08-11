/**
   * Check surrounding of given field if it has bombs and calculate the amount of surrounding bombs
   * If no bomb in surrounding => check recursively the fields in surrounding - once we found a bomb we stop there 
   */
const checkFieldSurrounding = (field, board, config) => {
  let row = field.row;
  let col = field.col;

  // determine range around the given field where to check for bombs
  let rowStart = row > 0 ? row - 1 : row;
  let rowEnd = row < config.rows - 1 ? row + 1 : row;
  let colStart = col > 0 ? col - 1 : col;
  let colEnd = col < config.cols - 1 ? col + 1 : col;

  let bombsAround = 0;
  let fieldsSurroundedToCheck = [];

  // check direct surrounding

  // loop through rows
  for (let r = rowStart; r <= rowEnd; r++) {
    // loop through cols
    for (let c = colStart; c <= colEnd; c++) {
      // skip field itself
      if (r === row && c === col) {
        continue;
      }
      // ignore already checked fields
      let field = board[r][c];
      if (field.bomb) {
        bombsAround++;
      }
      // also check the surrounding of the given field
      if (!field.bomb && !field.checked) {
        fieldsSurroundedToCheck.push(field);
      }
    }
  }
  // set bombs that were found in surrounding
  field.bombsAround = bombsAround;
  field.checked = true;

  // only continue checking fields which do not have a bomb in their surrounding
  // if we found a bomb in surrounding => check fields in surround which are no bombs and check THEIR surrounding too
  if (bombsAround === 0) {
    fieldsSurroundedToCheck.forEach((fieldSub) => {
      checkFieldSurrounding(fieldSub, board, config);
    });
  }
  return board;

};

export default checkFieldSurrounding