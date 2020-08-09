import React, { useState } from "react";

const Board = () => {

  // - Field states: bomb, bomb count in surrounding, bomb count in surrounding = 0 => check surrounding
  // - stop surrounding check if a bomb was found in surrounding => display bomb count


  let [gameOver, setGameOver] = useState(false)
  let [reloadBoard, setReloadBoard] = useState(0)
  let [bombsPlaced, setBombsPlaced] = useState(false)


  let boardConfig = {
    rows: 8,
    cols: 8,
    bombs: 10
  }

  // initialize board array
  let [boardArray, setBoardArray] = useState([])

  const initBoard = () => {

    if(boardArray.length > 0) {
      // console.log("Board already initialized - do not init again")
      return
    }

    console.log("Creating board...")

    let arr = new Array(boardConfig.rows)
    arr.fill(new Array(boardConfig.cols).fill(''))
    // initialize board objects
    arr = arr.map((row, rowIndex) => {
      return row.map((item, colIndex) => {
        return { checked: false, bomb: false, bombsAround: 0, row: rowIndex, col: colIndex }
      })
    })
    setBoardArray(arr)
  }

  const placeBombsRandomly = () => {
    
    if(boardArray.length == 0) {
      // console.log("Board not initialized - not placing bombs")
      return
    }
    if(bombsPlaced) {
      // console.log("Bombs already placed - not placing bombs")
      return
    }
    
    console.log("Placing bombs...")
    
    // place configured amount of bombs randomly on board
    for(let i=0; i<boardConfig.bombs; i++) {
      // generate random row / col entries and check if still free
      // otherwise try once more
      let bombPlaced = false
  
      let row = 0
      let col = 0
      while(!bombPlaced) {
        row = Math.floor(Math.random()*boardConfig.rows)
        col = Math.floor(Math.random()*boardConfig.cols)
        if(!isBomb(row, col)) {
          setBomb(row, col)
          bombPlaced = true
        }
      }
    }
    setBombsPlaced(true)
  }

  const getField = (row, column) => {
    return boardArray[row][column]
  }
  const isBomb = (row, column) => {
    return getField(row, column).bomb
  }
  const setBomb = (row, column, status = true) => {
    boardArray[row][column].bomb = status
  }

/**
   * Return value of check surrounding?
   * 
   * => nothing: just mark fields and label bomb count!
   *  
   * @param {*} field 
   */
  const checkSurrounding = (field) => {
    let row = field.row
    let col = field.col

    let rowStart = (row > 0 ? row-1 : row)
    let rowEnd = (row < boardConfig.rows-1 ? row+1 : row)
    let colStart = (col > 0 ? col-1 : col)
    let colEnd = (col < boardConfig.cols-1 ? col+1 : col)

    let bombsAround = 0;
    let fieldsSurroundedToCheck = []

    // loop through rows
    for(let r = rowStart; r<=rowEnd; r++) {
      // loop through cols
      for(let c = colStart; c<=colEnd; c++) {
        // skip field itself
        if(r == row && c == col) {
          continue;
        }
        // ignore already checked fields
        let field = getField(r, c)
        if(field.bomb) {
          bombsAround++
        }
        if(field.checked) {
          continue
        }
        field.checked = true
        fieldsSurroundedToCheck.push(field)
      }
    }
    // set bombs that were found in surrounding
    field.bombsAround = bombsAround
    console.log(fieldsSurroundedToCheck.length)

    // if we found a bomb in surrounding => check fields in surround which are no bombs and check THEIR surrounding too
    // if we did not found a bomb in surrounding, we check ALL our surrounded fields
    if(bombsAround == 0 && fieldsSurroundedToCheck.length > 0) {
      fieldsSurroundedToCheck.forEach(fieldSub => {
        checkSurrounding(fieldSub)        
      })
    }

  }

  const checkField = (field) => {
    console.log("Clicked: ", field)

    // bomb clicked? game ends!
    if(field.bomb) {
      setGameOver(true)
    }

    field.checked = true
    checkSurrounding(field)
    setReloadBoard(reloadBoard+1)
  }

  initBoard()
  placeBombsRandomly()


  // render array
  let jsxBoard = ""
  // let styleBtn = { width: '20px', height: '20px', padding: 0, textAlign: 'center' }

  // create board of buttons from two dimensional array
  jsxBoard = boardArray.map((row, r) => {
    return <div key={r}>{ 
      row.map((field, c) => {
        return <button key={c}
          onClick={() => !gameOver ? checkField(field) : null}
          style={{ 
            width: '30px', height: '30px', padding: 0, 
            textAlign: 'center', 
            backgroundColor: (field.checked ? 'red': '#ccc') 
          }}>{
            // (field.bombsAround > 0 ? field.bombsAround : <>&nbsp;</>)
            field.bomb ? "b" : (field.bombsAround > 0 ? field.bombsAround : <>&nbsp;</>)
        }</button>
      })
    }</div>
  })

  return (
    <>
      { jsxBoard }
      {/* {JSON.stringify(bombPositions, null, 2)} */}
      { gameOver && <div>GAME OVER!</div>}
    </>
  );

}

export default Board;