import React from 'react';

const Field = ({ field, gameOver, flagField, checkField }) => {

  const setFieldImg = () => {
    return gameOver() && field.bomb ? // game over? show all bombs
    <>&#128163;</> : field.flagged ? // field flagged by user? show flag 
    <>&#127988;</> : (field.bombsAround > 0 ? field.bombsAround : <>&nbsp;</>) // bombs around? show bomb count
  // flag: &#127988
  // pirate flag: &#65039
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

  return ( <button 
    onContextMenu={(e) => gameOver() ? null : flagField(e, field) }
    onClick={() => gameOver() ? null : checkField(field)}
    style={setFieldStyle(field)}>{ setFieldImg(field)}</button>  
  );
}
 
export default Field;