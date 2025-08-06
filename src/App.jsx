import { useState } from 'react'

function Square({value, onSquareClick, isWinning}) {
  return (
    <button 
      className={`w-20 h-20 bg-white border-2 border-gray-300 rounded-xl text-3xl font-bold 
                  hover:bg-gray-50 hover:border-blue-400 hover:shadow-md transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  ${isWinning ? 'bg-green-100 border-green-400 text-green-700' : ''}
                  ${value === 'X' ? 'text-blue-600' : value === 'O' ? 'text-red-500' : 'text-gray-400'}
                  active:scale-95`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick (i) {
    if(squares[i] || calculateWinner(squares).winner){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares)
  }
  
  const {winner, winningLine} = calculateWinner(squares);
  let status;
  if(winner){
    status = (
      <div className="text-2xl font-bold text-green-600 animate-pulse">
        🎉 Winner: <span className={winner === 'X' ? 'text-blue-600' : 'text-red-500'}>{winner}</span> 🎉
      </div>
    );
  } else if (squares.every(square => square)) {
    status = <div className="text-2xl font-bold text-gray-600">🤝 It's a Draw! 🤝</div>;
  } else {
    status = (
      <div className="text-xl font-semibold text-gray-700">
        Next player: <span className={xIsNext ? 'text-blue-600' : 'text-red-500'}>{xIsNext ? 'X' : 'O'}</span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">{status}</div>
      <div className="bg-gray-100 p-4 rounded-2xl shadow-lg">
        <div className="grid grid-cols-3 gap-2">
          {squares.map((square, i) => (
            <Square 
              key={i}
              onSquareClick={() => handleClick(i)} 
              value={square}
              isWinning={winningLine && winningLine.includes(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Game () {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]
  
  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }
  
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if(move > 0){
      description = `Move #${move}`;
    } else {
      description = "Game Start";
    }
    
    const isCurrentMove = move === currentMove;
    
    return (
      <li key={move} className="mb-2">
        <button 
          onClick={() => jumpTo(move)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 w-full text-left
                     ${isCurrentMove 
                       ? 'bg-blue-500 text-white shadow-md' 
                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'}`}
        >
          {description}
        </button>
      </li>
    )
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🎮 Tic-Tac-Toe 🎮
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="flex-1 flex justify-center">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
          </div>
          
          <div className="flex-1 max-w-xs">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Game History</h3>
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                           transition-colors duration-200 font-medium text-sm"
                >
                  New Game
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ol className="space-y-1">{moves}</ol>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Play</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Players take turns placing <span className="text-blue-600 font-semibold">X</span> and{' '}
              <span className="text-red-500 font-semibold">O</span> on the grid. 
              First to get three in a row wins! Use the history panel to review or jump back to any previous move.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {winner: squares[a], winningLine: lines[i]};
    }
  }
  return {winner: null, winningLine: null};
}

export default Game