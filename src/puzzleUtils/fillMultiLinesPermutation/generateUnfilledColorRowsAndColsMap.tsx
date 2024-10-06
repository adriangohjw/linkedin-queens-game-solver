import { CellContentType, ColorType, CellType } from "../../types";
import { COLOR_OPTIONS } from "../../constant";

const generateUnfilledColorRowsAndColsMap = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}): Record<string, { rows: number[]; cols: number[] }> => {
  let result: Record<string, CellType[]> = Object.fromEntries(
    COLOR_OPTIONS.map((color) => [color, []])
  );

  puzzleContent.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        const color: ColorType = puzzleColors[rowIndex][colIndex];
        if (color) {
          result[color].push({ row: rowIndex, col: colIndex } as CellType);
        }
      }
    });
  });

  Object.keys(result).forEach((color) => {
    if (result[color].length === 0) {
      delete result[color];
    }
  });

  return Object.fromEntries(
    Object.keys(result).map((color) => [
      color,
      {
        rows: Array.from(new Set(result[color].map((cell) => cell.row))).sort(
          (a, b) => a - b
        ),
        cols: Array.from(new Set(result[color].map((cell) => cell.col))).sort(
          (a, b) => a - b
        ),
      },
    ])
  );
};

export default generateUnfilledColorRowsAndColsMap;
