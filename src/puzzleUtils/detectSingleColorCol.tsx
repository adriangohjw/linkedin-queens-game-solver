import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNo } from "./markUtils";

const detectSingleColorCol = ({
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
  if (uniqueColors.size === 1) {
    const color: ColorType = uniqueColors.values().next().value;
    if (color) {
      let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
        puzzleContent,
      });
      // markNoForColorExceptCol
      for (let i = 0; i < size; i++) {
        if (i !== col) {
          for (let j = 0; j < size; j++) {
            if (puzzleColors[j][i] === color) {
              newPuzzleContent = markNo({
                puzzleContent: newPuzzleContent,
                cell: { row: j, col: i } as CellType,
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

export default detectSingleColorCol;
