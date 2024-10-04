import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNo } from "./markUtils";

const fillColorInSingleRowOrCol = ({
  color,
  puzzleContent,
  puzzleColors,
  emptyCells,
}: {
  color: ColorType;
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  const size: number = puzzleContent.length;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  const rowIndices = new Set(emptyCells.map((cell) => cell.row));
  if (rowIndices.size === 1) {
    const row = rowIndices.values().next().value;
    if (typeof row === "number") {
      for (let i = 0; i < size; i++) {
        if (puzzleColors[row][i] !== color) {
          newPuzzleContent = markNo({
            puzzleContent: newPuzzleContent,
            cell: { row, col: i } as CellType,
          });
        }
      }
    }
  }

  const colIndices = new Set(emptyCells.map((cell) => cell.col));
  if (colIndices.size === 1) {
    const col = colIndices.values().next().value;
    if (typeof col === "number") {
      for (let i = 0; i < size; i++) {
        if (puzzleColors[i][col] !== color) {
          newPuzzleContent = markNo({
            puzzleContent: newPuzzleContent,
            cell: { row: i, col } as CellType,
          });
        }
      }
    }
  }

  return newPuzzleContent;
};

export default fillColorInSingleRowOrCol;
