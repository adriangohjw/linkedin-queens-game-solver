import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNo } from "./markUtils";
import { getUniqueRowIndices, getUniqueColIndices } from "./util";

const fillColorInSingleRow = ({
  size,
  color,
  puzzleContent,
  puzzleColors,
  emptyCells,
}: {
  size: number;
  color: ColorType;
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  const uniqueRowIndices = getUniqueRowIndices({ cells: emptyCells });
  if (uniqueRowIndices.length === 1) {
    const row = uniqueRowIndices.values().next().value;
    if (typeof row === "number") {
      for (let i = 0; i < size; i++) {
        if (puzzleColors[row][i] !== color) {
          puzzleContent = markNo({
            puzzleContent,
            cell: { row, col: i } as CellType,
          });
        }
      }
    }
  }
  return puzzleContent;
};

const fillColorInSingleCol = ({
  size,
  color,
  puzzleContent,
  puzzleColors,
  emptyCells,
}: {
  size: number;
  color: ColorType;
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  const uniqueColIndices = getUniqueColIndices({ cells: emptyCells });
  if (uniqueColIndices.length === 1) {
    const col = uniqueColIndices.values().next().value;
    if (typeof col === "number") {
      for (let i = 0; i < size; i++) {
        if (puzzleColors[i][col] !== color) {
          puzzleContent = markNo({
            puzzleContent,
            cell: { row: i, col } as CellType,
          });
        }
      }
    }
  }
  return puzzleContent;
};

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

  newPuzzleContent = fillColorInSingleRow({
    size,
    color,
    puzzleContent: newPuzzleContent,
    puzzleColors,
    emptyCells,
  });

  newPuzzleContent = fillColorInSingleCol({
    size,
    color,
    puzzleContent: newPuzzleContent,
    puzzleColors,
    emptyCells,
  });

  return newPuzzleContent;
};

export default fillColorInSingleRowOrCol;
