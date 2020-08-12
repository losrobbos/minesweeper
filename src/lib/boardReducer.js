import createObjectMatrix from "./createObjectMatrix";
import checkFieldSurrounding from "./checkFieldSurrounding";

// ACTION TYPES
export const INIT_BOARD = "INIT_BOARD"
export const CHECK_FIELD = "CHECK_FIELD"
export const FLAG_FIELD = "FLAG_FIELD"

export const gameStates = { running: 'running', lost: 'lost', won: 'won' }

export const initialState = {
  board: [], config: { rows: 8, cols: 8, bombs: 10 }, gameState: gameStates.running, 
}

// REDUCER
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


export default boardReducer