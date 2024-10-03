import { ColorType, CellContentType } from "./types";
import { YES, getColorCode } from "./constant";

export default function Puzzle({
  size,
  content,
  isSolved,
  colors,
}: {
  size: number;
  content?: CellContentType[][];
  isSolved?: boolean;
  colors?: ColorType[][];
}) {
  const rows = Array.from({ length: size }, (_, rowIndex) => (
    <div key={rowIndex} className="flex flex-row">
      {Array.from({ length: size }, (_, colIndex) => {
        const cellContent: ColorType = content?.[rowIndex]?.[colIndex] ?? null;
        return (
          <div
            key={colIndex}
            className={`border border-black w-10 h-10 flex items-center justify-center`}
            style={{
              backgroundColor: getColorCode(colors?.[rowIndex]?.[colIndex]),
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
