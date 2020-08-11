import React, { useReducer } from "react";
import { useEffect } from "react";
import Field from "./Field";
import createObjectMatrix from "../lib/createObjectMatrix";
import checkFieldSurrounding from "../lib/checkFieldSurrounding";

const INIT_BOARD = "INIT_BOARD"
const CHECK_FIELD = "CHECK_FIELD"
const FLAG_FIELD = "FLAG_FIELD"

const gameStates = { running: 'running', lost: 'lost', won: 'won' }

const initialState = {
  board: [], config: { rows: 8, cols: 8, bombs: 10 }, gameState: gameStates.running, 
}

const boardReducer = (state, action) => {

  console.log("REDUCER - Action received: ", action)

  switch(action.type) {
    
    case INIT_BOARD:
      let boardConfig = {...state.config, ...action.payload} // get config from payload
      boardConfig.fieldsTotal = boardConfig.rows*boardConfig.cols
      boardConfig.fieldsNoBombs = boardConfig.fieldsTotal-boardConfig.bombs

      // create two dimensional array of field objects
      let boardInitial = createObjectMatrix(boardConfig.rows, boardConfig.cols, { 
        checked: false, flagged: false, bomb: false, bombsAround: 0, 
      })

      // place bombs (randomly)
      for(let i=0; i<boardConfig.bombs; i++) {

        let bombPlaced = false
  
        while(!bombPlaced) {
          let row = Math.floor(Math.random()*boardConfig.rows) // random row
          let col = Math.floor(Math.random()*boardConfig.cols) // random col

          // avoid placing a bomb twice on the same spot...
          let field = boardInitial[row][col]
          if(!field.bomb) {
            field.bomb = true
            bombPlaced = true
          }
        }
      }
  
      return { ...state, 
        board: boardInitial, 
        config: boardConfig,
        gameState: gameStates.running // reset game state
      }

    case CHECK_FIELD:
      // bomb clicked? game ends!
      let field = action.payload

      if(field.bomb) {        
        return {...state, gameState: gameStates.lost}
      }

      // check fields recursively
      let boardUpdated = checkFieldSurrounding(field, state.board, state.config )

      // check game state
      let fieldsChecked = 0
      let gameState = state.gameState
      boardUpdated.forEach(row => row.forEach(field => {
        if(field.checked) { fieldsChecked++ }
      }))
      if(fieldsChecked == state.config.fieldsNoBombs) {
        console.log("Game won!")
        gameState = gameStates.won
      }
  
      return {...state, board: [...boardUpdated], gameState }

    case FLAG_FIELD:
      let { row, col } = action.payload
      let boardCopy = [...state.board]
      let fieldToFlag = boardCopy[row][col]
      fieldToFlag.flagged = !fieldToFlag.flagged
      return {...state, board: boardCopy }

    default:
      return state
  }

}


const Board = () => {

  let [state, dispatch] = useReducer(boardReducer, initialState)
  let { board, config, gameState } = state

  // initialize board on load
  useEffect(() => {
    dispatch({type: "INIT_BOARD"})
  }, [])


  const gameOver = () => {
    console.log("Game State: ", gameState)
    return gameState !== gameStates.running
  }

  const resetGame = () => {
    dispatch({type: "INIT_BOARD"})
  }

  const flagField = (field) => dispatch({type: FLAG_FIELD, payload: field})
  const checkField = (field) => dispatch({type: CHECK_FIELD, payload: field})

  const createBoardUi = () => {
    // create board of buttons from two dimensional array
    return board.map((row, r) => (
      <div key={r}>{ 
        row.map((field, c) => (
          <Field 
            key={ r + "-" + c }
            field={field} 
            flagField={() => flagField(field)} 
            checkField={() => checkField(field)} 
            gameOver={gameOver} />
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