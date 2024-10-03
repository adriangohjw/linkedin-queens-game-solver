import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNo } from "./markUtils";

const detectThreeAdjacentEmptyCellsInRow = ({
  puzzleContent,
  row,
  cells,
}: {
  puzzleContent: CellContentType[][];
  row: number;
  cells: CellType[];
}): CellContentType[][] => {
  const colIndices: number[] = cells.map((cell) => cell.col);
  let uniqueColIndices: number[] = Array.from(new Set(colIndices));
  if (uniqueColIndices.length !== 3) return puzzleContent;

  uniqueColIndices.sort((a, b) => a - b);
  const [firstCol, secondCol, thirdCol]: [number, number, number] =
    uniqueColIndices as [number, number, number];
  if (firstCol - secondCol !== 1 || secondCol - thirdCol !== 1)
    return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = markNo({
    puzzleContent: newPuzzleContent,
    cell: { row: row - 1, col: secondCol } as CellType,
  });
  newPuzzleContent = markNo({
    puzzleContent: newPuzzleContent,
    cell: { row: row + 1, col: secondCol } as CellType,
  });
  return newPuzzleContent;
};

const detectThreeAdjacentEmptyCellsInCol = ({
  puzzleContent,
  col,
  cells,
}: {
  puzzleContent: CellContentType[][];
  col: number;
  cells: CellType[];
}): CellContentType[][] => {
  const rowIndices: number[] = cells.map((cell) => cell.row);
  let uniqueRowIndices: number[] = Array.from(new Set(rowIndices));
  if (uniqueRowIndices.length !== 3) return puzzleContent;

  uniqueRowIndices.sort((a, b) => a - b);
  const [firstRow, secondRow, thirdRow]: [number, number, number] =
    uniqueRowIndices as [number, number, number];
  if (secondRow - firstRow !== 1 || thirdRow - secondRow !== 1)
    return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = markNo({
    puzzleContent: newPuzzleContent,
    cell: { row: secondRow, col: col - 1 } as CellType,
  });
  newPuzzleContent = markNo({
    puzzleContent: newPuzzleContent,
    cell: { row: secondRow, col: col + 1 } as CellType,
  });
  return newPuzzleContent;
};

const detectThreeAdjacentEmptyCells = ({
  puzzleContent,
  color,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  color: ColorType;
  getEmptyCells: ({ color }: { color: ColorType }) => CellType[];
}): CellContentType[][] => {
  const emptyCells: CellType[] = getEmptyCells({ color });
  if (emptyCells.length !== 3) return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = detectThreeAdjacentEmptyCellsInCol({
    puzzleContent: newPuzzleContent,
    col: emptyCells[0].col,
    cells: emptyCells,
  });
  newPuzzleContent = detectThreeAdjacentEmptyCellsInRow({
    puzzleContent: newPuzzleContent,
    row: emptyCells[0].row,
    cells: emptyCells,
  });
  return newPuzzleContent;
};

export default detectThreeAdjacentEmptyCells;
