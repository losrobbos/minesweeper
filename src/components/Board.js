import React, { useState } from "react";
import { useEffect } from "react";

const Board = () => {

  // - Field states: bomb, bomb count in surrounding, bomb count in surrounding = 0 => check surrounding
  // - stop surrounding check if a bomb was found in surrounding => display bomb count

  let [boardArray, setBoardArray] = useState([])
  let [bombsPlaced, setBombsPlaced] = useState(false)
  let [fieldsChecked, setFieldsChecked] = useState(0)
  
  let gameStates = { running: 'running', lost: 'lost', won: 'won' }
  let [gameState, setGameState] = useState("running")
  let [reload, setReload] = useState(0)

  let boardConfig = {
    rows: 8,
    cols: 8,
    bombs: 10
  }
  boardConfig.fieldsTotal = boardConfig.rows*boardConfig.cols
  boardConfig.fieldsNoBombs = boardConfig.fieldsTotal-boardConfig.bombs


  const initBoard = () => {

    console.log("Creating board...")

    let arr = new Array(boardConfig.rows)
    arr.fill(new Array(boardConfig.cols).fill(''))
    // initialize board objects
    arr = arr.map((row, rowIndex) => {
      return row.map((item, colIndex) => {
        return { 
          checked: false, 
          flagged: false,
          bomb: false, 
          bombsAround: 0, 
          row: rowIndex, 
          col: colIndex }
      })
    })
    setBoardArray(arr)
  }

  const placeBombsRandomly = () => {
    
    if(bombsPlaced) { return } // bombs already placed? return
    
    console.log("Placing bombs...")
    
    // place configured amount of bombs randomly on board
    for(let i=0; i<boardConfig.bombs; i++) {
      // generate random row / col entries and check if still free
      // otherwise try once more
      let bombPlaced = false
  
      let row = 0
      let col = 0
      while(!bombPlaced) {
        row = Math.floor(Math.random()*boardConfig.rows) // random row
        col = Math.floor(Math.random()*boardConfig.cols) // random col
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

  // when field was clicked 
  // => check if game is done!
  // game is done if:
  //  - checked fields cound == normal Fields count
  //  - flags do not need - and prob SHOULD not get evaluated
  useEffect(() => {
    console.log("Fields checked: ", `${fieldsChecked}/${boardConfig.fieldsNoBombs}`)
    if(fieldsChecked == boardConfig.fieldsNoBombs) {
      console.log("Game won!")
      setGameState(gameStates.won)
    }
  }, [fieldsChecked, boardConfig, gameStates])


  // board initialized? => place bombs
  useEffect(() => {
    if(boardArray.length > 0) {
      placeBombsRandomly()
    }
    else {
      initBoard()
    }
  }, [boardArray])

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

    // check direct surrounding

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
        fieldsSurroundedToCheck.push(field)
      }
    }
    // set bombs that were found in surrounding
    field.bombsAround = bombsAround
    field.checked = true
    // setFieldsChecked([...fieldsChecked, 1])

    // only continue checking fields which do not have a bomb in their surrounding
    // if we found a bomb in surrounding => check fields in surround which are no bombs and check THEIR surrounding too
    if(bombsAround == 0) {
      fieldsSurroundedToCheck.forEach(fieldSub => {
        if(!fieldSub.bomb && !fieldSub.checked) {
          checkSurrounding(fieldSub)
        }
      })
    }
  }

  const flagField = (e, field) => {
    e.preventDefault()
    
    field.flagged = !field.flagged
    setReload(reload +1)
  }

  const checkField = (field) => {
    // console.log("Clicked: ", field)

    // bomb clicked? game ends!
    if(field.bomb) {
      setGameState(gameStates.lost)
      return
    }

    // check if won!
    checkSurrounding(field)
    // setReload(reload+1)
    countChecked() // mark checked fields and reload board
  }

  const countChecked = () => {
    let checkedFieldsCount = 0
    boardArray.forEach(row => row.forEach(field => {
      if(field.checked) { checkedFieldsCount++ }
    }))
    setFieldsChecked(checkedFieldsCount)
  }

  const setFieldImg = (field) => {
    return gameOver() && field.bomb ? // game over? show all bombs
    <>&#128163;</> :
    field.flagged ? // field flagged by user? show flag 
    <>&#127988;</> :
    (field.bombsAround > 0 ? field.bombsAround : <>&nbsp;</>) // bombs around? show bomb count
  // flag: &#127988
  // pirate flag: &#65039
  }

  const gameOver = ( ) => {
    return gameState !== gameStates.running
  }

  const resetGame = () => {
    setFieldsChecked(0)
    setGameState(gameStates.running)
    setBombsPlaced(false); 
    setBoardArray([])
  }

  const createBoardUi = () => {
    // create board of buttons from two dimensional array
    return boardArray.map((row, r) => (
      <div key={r}>{ 
        row.map((field, c) => (
        <button 
          key={c}
          onContextMenu={(e) => gameOver() ? null : flagField(e, field) }
          onClick={() => gameOver() ? null : checkField(field)}
          style={{ 
            width: '30px', height: '30px', padding: 0, 
            textAlign: 'center', 
            backgroundColor: (field.checked ? 'red': '#ccc') 
          }}>{ setFieldImg(field)}</button>
        ))}
      </div>
    ))
  }

  return (
    <>
      { createBoardUi() }
      {/* {JSON.stringify(bombPositions, null, 2)} */}
      { gameOver() && <div> { gameState == gameStates.won ? "YOU WON!" : "YOU LOST!" } </div>}
      <button style={{ marginTop: '10px'}} onClick={() => resetGame() } >New Game</button>
    </>
  );

}

export default Board;