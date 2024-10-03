import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNoFunction } from "./markUtils";

const detectSingleColorRowFunction = ({
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
  if (uniqueColors.size === 1) {
    const color: ColorType = uniqueColors.values().next().value;
    if (color) {
      let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
        puzzleContent,
      });
      // markNoForColorExceptRow
      for (let i = 0; i < size; i++) {
        if (i !== row) {
          for (let j = 0; j < size; j++) {
            if (puzzleColors[i][j] === color) {
              newPuzzleContent = markNoFunction({
                puzzleContent: newPuzzleContent,
                cell: { row: i, col: j } as CellType,
              });
            }
          }
        }
      }
      return newPuzzleContent;
    }
    return puzzleContent;
  }
  return puzzleContent;
};

export default detectSingleColorRowFunction;
