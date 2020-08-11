import React from 'react';

const Field = ({ field, gameOver, flagField, checkField }) => {

  // flag: &#127988
  // pirate flag: &#65039
  const setFieldImg = () => {
    return gameOver() && field.bomb ? // game over? show all bombs
    <>&#128163;</> : field.flagged ? // field flagged by user? show flag 
    <>&#127988;</> : (field.bombsAround > 0 ? field.bombsAround : <>&nbsp;</>) // bombs around? show bomb count
  }

  const setFieldStyle = () => {
    let style = { 
      width: '30px', 
      height: '30px', 
      padding: 0, 
      textAlign: 'center', 
      backgroundColor: (field.checked ? 'darkgray': '#ccc'),
      fontWeight: 'bold'
    }
    return style
  }

  const flagFieldAndHideContextMenu = (e) => {
    e.preventDefault() // prevent showing of context menu!
    flagField()
  }

  return ( <button 
    onContextMenu={(e) => gameOver() ? null : flagFieldAndHideContextMenu(e) }
    onClick={() => gameOver() ? null : checkField()}
    style={setFieldStyle(field)}>{ setFieldImg(field)}</button>  
  );
}
 
export default Field;