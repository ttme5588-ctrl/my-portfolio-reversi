import "./App.css"
import Board from './components/Bord';
import { useState, useEffect } from 'react';

type SquareValue = 'B' | 'W' | null;
type Move = {
  row: number;
  col: number;
  flips: { row: number; col: number }[];
};

const themes = ['light', 'dark', 'rose', 'orange'];

function createInitialSquares(): SquareValue[][] {
  const squares: SquareValue[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  squares[3][3] = 'W';
  squares[3][4] = 'B';
  squares[4][3] = 'B';
  squares[4][4] = 'W';
  return squares; 
}

function calculateValidMoves(squares: SquareValue[][], player: 'B' | 'W'): Move[] {
  const directions = [
    [-1, 0], [-1, 1], [0, 1], [1, 1],
    [1, 0], [1, -1], [0, -1], [-1, -1]
  ];
  const opponent = player === 'B' ? 'W' : 'B';
  const validMoves: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (squares[r][c]) {
        continue;
      }
      let allFlipsInAllDirs: { row: number; col: number }[] = [];
      for (const [dr, dc] of directions) {
      const flipsInOneDir: {row: number, col: number}[] = [];        
      let currR = r + dr;
        let currC = c + dc;
        while (currR >= 0 && currR < 8 && currC >= 0 && currC < 8 && squares[currR][currC] === opponent) {
          flipsInOneDir.push({ row: currR, col: currC });
          currR += dr;
          currC += dc;
        }
        if (currR >= 0 && currR < 8 && currC >= 0 && currC < 8 && squares[currR][currC] === player) {
          if (flipsInOneDir.length > 0) {
            allFlipsInAllDirs = allFlipsInAllDirs.concat(flipsInOneDir);
          }
        }
      }
      if (allFlipsInAllDirs.length > 0) {
        validMoves.push({ row: r, col: c, flips: allFlipsInAllDirs });
      }
    }
  }
  return validMoves;
}

export default function App() {
  const [squares, setSquares] = useState<SquareValue[][]>(createInitialSquares());
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  
  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  function handlePlay(row: number, col: number) {
    if (isGameOver || squares[row][col]) {
      return;
    }
    const currentPlayer = isBlackTurn ? 'B' : 'W';
    const validMoves = calculateValidMoves(squares, currentPlayer);
    const move = validMoves.find(m => m.row === row && m.col === col);
    if (!move) {
      return;
    }
    const nextSquares = squares.map(rowArray => rowArray.slice() as SquareValue[]);
    nextSquares[row][col] = currentPlayer;
    move.flips.forEach(flip => {
      nextSquares[flip.row][flip.col] = currentPlayer;
    });
    setSquares(nextSquares);
    setIsBlackTurn(!isBlackTurn);
  }

  useEffect(() => {
    if (isGameOver) {
      return;
    }
    const currentPlayer = isBlackTurn ? 'B' : 'W';
    const opponent = isBlackTurn ? 'W' : 'B';
    const currentPlayerValidMoves = calculateValidMoves(squares, currentPlayer);
    if (currentPlayerValidMoves.length === 0) {
      const opponentValidMoves = calculateValidMoves(squares, opponent);
      if (opponentValidMoves.length === 0) {
        setIsGameOver(true);
        const blackScore = squares.flat().filter(s => s === 'B').length;
        const whiteScore = squares.flat().filter(s => s === 'W').length;
        if (blackScore > whiteScore) setWinner("黒の勝ち");
        else if (whiteScore > blackScore) setWinner("白の勝ち");
        else setWinner("引き分け");
      } else {
        alert(`${currentPlayer} はパスします。`);
        setIsBlackTurn(!isBlackTurn);
      }
    }
  }, [squares, isBlackTurn, isGameOver]);

   function handleReset() {
    setSquares(createInitialSquares());
    setIsBlackTurn(true);
    setIsGameOver(false);
    setWinner(null);
  }
  
  function handleChangeTheme() {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  }
  
  useEffect(() => {
    document.body.className = currentTheme;
  }, [currentTheme]);

  const blackScore = squares.flat().filter(s => s === 'B').length;
  const whiteScore = squares.flat().filter(s => s === 'W').length;

  let status;
  if (isGameOver) {
    status = `ゲーム終了: ${winner}`;
  } else {
    status = (
      <div className="status-line">
        <span>Next Player: </span>
        <div className={`stone info-stone stone-${isBlackTurn ? 'B' : 'W'}`}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="game" >
        <div className="game-info">
          <div style={{ padding: "8px" }}>{status}</div>

          <div className="score" style={{ padding: "8px" }}>
            <div className="score-item">
              <div className="stone info-stone stone-B"></div>
              <span>: {blackScore}</span>
            </div>
            <strong>vs</strong>
            <div className="score-item">
              <div className="stone info-stone stone-W"></div>
              <span>: {whiteScore}</span>
            </div>
          </div>
          <div className="game-controls" style={{paddingTop:"24px"}}>
            <button onClick={handleReset}>リセット</button>
            <button onClick={handleChangeTheme}>テーマ変更</button>
          </div>
        </div>
        <Board squares={squares} onPlay={handlePlay} />
      </div>
    </div>
  );
}