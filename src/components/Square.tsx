type SquareValue = 'B' | 'W' | null;

type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
};

export default function Square({ value, onSquareClick }: SquareProps) {
  return (
    // ★ button要素をdiv要素に戻す
    // ★ Squareのクラス名をシンプルにし、背景色などはCSS変数で制御
    <div className="square-cell" onClick={onSquareClick}>
      {value && (
        <div className={"stone " + (value === 'B' ? 'stone-B' : 'stone-W')}></div>
      )}
    </div>
  );
}