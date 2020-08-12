import React, { useReducer, useEffect } from "react";
import Field from "./Field";
import boardReducer, { initialState, gameStates, INIT_BOARD, CHECK_FIELD, FLAG_FIELD } from "../lib/boardReducer";


const Board = () => {

  let [state, dispatch] = useReducer(boardReducer, initialState)
  let { board, gameState, config } = state

  // initialize board on load
  useEffect(() => {
    dispatch({ type: INIT_BOARD })
  }, [])


  const gameOver = () => {
    return gameState !== gameStates.running
  }

  const resetGame = () => {
    dispatch({ type: INIT_BOARD })
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