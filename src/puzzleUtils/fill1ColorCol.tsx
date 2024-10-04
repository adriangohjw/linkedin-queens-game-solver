import { CellContentType, CellType, ColorType } from "../types";
import { markNo } from "./markUtils";

const markNoForColorExceptCol = ({
  puzzleContent,
  puzzleColors,
  size,
  col,
  color,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  size: number;
  col: number;
  color: ColorType;
}): CellContentType[][] => {
  for (let i = 0; i < size; i++) {
    if (i !== col) {
      for (let j = 0; j < size; j++) {
        if (puzzleColors[j][i] === color) {
          puzzleContent = markNo({
            puzzleContent,
            cell: { row: j, col: i } as CellType,
          });
        }
      }
    }
  }
  return puzzleContent;
};

const fill1ColorCol = ({
  puzzleContent,
  col,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  col: number;
  puzzleColors: ColorType[][];
}): CellContentType[][] => {
  const size: number = puzzleContent.length;

  const emptyCellIndices: number[] = puzzleColors[col]
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCellIndices.length === 0) return puzzleContent;

  const uniqueColors: Set<ColorType> = new Set(
    emptyCellIndices
      .map((index) => puzzleColors[index][col])
      .filter((cell) => cell !== null)
  );
  if (uniqueColors.size !== 1) return puzzleContent;

  const color: ColorType = uniqueColors.values().next().value;
  return color
    ? markNoForColorExceptCol({
        puzzleContent,
        puzzleColors,
        size,
        col,
        color,
      })
    : puzzleContent;
};

export default fill1ColorCol;
