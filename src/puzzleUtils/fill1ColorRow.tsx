import { CellContentType, CellType, ColorType } from "../types";
import { markNo } from "./markUtils";

const markNoForColorExceptRow = ({
  puzzleContent,
  puzzleColors,
  size,
  row,
  color,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  size: number;
  row: number;
  color: ColorType;
}): CellContentType[][] => {
  for (let i = 0; i < size; i++) {
    if (i !== row) {
      for (let j = 0; j < size; j++) {
        if (puzzleColors[i][j] === color) {
          puzzleContent = markNo({
            puzzleContent,
            cell: { row: i, col: j } as CellType,
          });
        }
      }
    }
  }
  return puzzleContent;
};

const fill1ColorRow = ({
  puzzleContent,
  row,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  row: number;
  puzzleColors: ColorType[][];
}) => {
  const size: number = puzzleContent.length;

  const emptyCellIndices: number[] = puzzleContent[row]
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCellIndices.length === 0) return puzzleContent;

  const uniqueColors: Set<ColorType> = new Set(
    emptyCellIndices
      .map((index) => puzzleColors[row][index])
      .filter((cell) => cell !== null)
  );
  if (uniqueColors.size !== 1) return puzzleContent;

  const color: ColorType = uniqueColors.values().next().value;
  return color
    ? markNoForColorExceptRow({
        puzzleContent,
        puzzleColors,
        size,
        row,
        color,
      })
    : puzzleContent;
};

export default fill1ColorRow;
