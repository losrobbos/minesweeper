import React from 'react';
import './App.scss';
import Board from './components/Board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Let's play Minesweeper</h1>
        <Board></Board>
      </header>
    </div>
  );
}

export default App;
