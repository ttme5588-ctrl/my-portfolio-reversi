// Board.js

import Square from './Square';

type SquareValue = 'B' | 'W' | null;

type BoardProps = {
  squares: SquareValue[][];
  onPlay: (row: number, col: number) => void; // ★ 追加：石を置く処理を実行する関数
};

// propsに onPlay を追加
export default function Board({ squares, onPlay }: BoardProps) {
  function handleClick(row: number, col: number) {
    // onPlay関数を呼び出して、クリックされた座標をAppコンポーネントに伝える
    onPlay(row, col);
  }

  return (
    <div className="board">
      {squares.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((square, j) => (
            <Square
              key={j}
              value={square}
              // ★ 修正：クリックされたらhandleClickを呼び出す
              onSquareClick={() => handleClick(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}