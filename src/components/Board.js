import React, { useState } from "react";
import { useEffect } from "react";
import Field from "./Field";

const Board = () => {

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
    arr = arr.map((row, rowIndex) => row.map((item, colIndex) => ({ 
        checked: false, 
        flagged: false,
        bomb: false, 
        bombsAround: 0, 
        row: rowIndex, 
        col: colIndex
      })
    ))
    setBoardArray(arr)
  }

  const placeBombsRandomly = () => {
    
    if(bombsPlaced) { return } // bombs already placed? return
    
    console.log("Placing bombs...")
    
    // place configured amount of bombs randomly on board
    for(let i=0; i<boardConfig.bombs; i++) {

      let bombPlaced = false
  
      while(!bombPlaced) {
        let row = Math.floor(Math.random()*boardConfig.rows) // random row
        let col = Math.floor(Math.random()*boardConfig.cols) // random col
        // avoid placing a bomb twice on the same spot...
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
   * Check surrounding of given field if it has bombs and calculate the amount
   * If no bomb => check recursively once - we found a bomb we stop there 
   *  
   * @param {*} field
   */
  const checkSurrounding = (field) => {
    let row = field.row
    let col = field.col

    // determine range around the given field where to check for bombs
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
        // also check the surrounding of the given field
        if(!field.bomb && !field.checked) {
          fieldsSurroundedToCheck.push(field)
        }
      }
    }
    // set bombs that were found in surrounding
    field.bombsAround = bombsAround
    field.checked = true

    // only continue checking fields which do not have a bomb in their surrounding
    // if we found a bomb in surrounding => check fields in surround which are no bombs and check THEIR surrounding too
    if(bombsAround == 0) {
      fieldsSurroundedToCheck.forEach(fieldSub => {
        checkSurrounding(fieldSub)
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

    checkSurrounding(field)
    countChecked() // mark checked fields and check if won
  }

  // update total of checked fields
  // will determine if player has won
  const countChecked = () => {
    let checkedFieldsCount = 0
    boardArray.forEach(row => row.forEach(field => {
      if(field.checked) { checkedFieldsCount++ }
    }))
    setFieldsChecked(checkedFieldsCount)
  }

  // when field was clicked 
  // => check if game is done!
  // game is done if: all "checked" fields == amount of fields without bombs count
  useEffect(() => {
    if(fieldsChecked == boardConfig.fieldsNoBombs) {
      console.log("Game won!")
      setGameState(gameStates.won)
    }
  }, [fieldsChecked, boardConfig, gameStates])


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
          <Field 
            key={ r + "-" + c }
            field={field} flagField={flagField} checkField={checkField} gameOver={gameOver} />
        ))}
      </div>
    ))
  }

  return (
    <>
      { createBoardUi() }
      { gameOver() && <div> { gameState == gameStates.won ? "YOU WON!" : "YOU LOST!" } </div>}
      <button style={{ marginTop: '10px'}} onClick={() => resetGame() } >New Game</button>
    </>
  );

}

export default Board;