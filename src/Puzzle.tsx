import { ColorType, CellType, CellContentType } from "./types";
import { YES, getColorCode } from "./constant";

export default function Puzzle({
  size,
  content,
  isSolved,
  colors,
  setPuzzleColor,
}: {
  size: number;
  content?: CellContentType[][];
  isSolved?: boolean;
  colors?: ColorType[][];
  setPuzzleColor?: ({ cell }: { cell: CellType }) => void;
}) {
  const rows = Array.from({ length: size }, (_, rowIndex) => (
    <div key={rowIndex} className="flex flex-row">
      {Array.from({ length: size }, (_, colIndex) => {
        const cellContent: ColorType = content?.[rowIndex]?.[colIndex] ?? null;
        const triggerSetPuzzleColor = (): void => {
          setPuzzleColor &&
            setPuzzleColor({
              cell: { row: rowIndex, col: colIndex } as CellType,
            });
        };
        return (
          <div
            key={colIndex}
            className={`border border-black w-10 h-10 flex items-center justify-center ${
              setPuzzleColor ? "hover:opacity-75 cursor-pointer" : ""
            }`}
            style={{
              backgroundColor: getColorCode(colors?.[rowIndex]?.[colIndex]),
            }}
            onClick={() => triggerSetPuzzleColor()}
            onMouseEnter={(e) => {
              // Check if the left mouse button is pressed
              e.buttons === 1 && triggerSetPuzzleColor();
            }}
          >
            <div className={cellContent === YES ? "text-xl" : "text-3xl"}>
              {cellContent}
            </div>
          </div>
        );
      })}
    </div>
  ));

  return (
    <div
      className={`flex flex-col justify-center items-center border-4 ${
        isSolved ? "border-green-500" : "border-black"
      }`}
    >
      {rows}
    </div>
  );
}
