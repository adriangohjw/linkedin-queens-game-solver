import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNoFunction } from "./markUtils";

const detectTwoAdjacentEmptyCellsInCol = ({
  puzzleContent,
  col,
  cells,
}: {
  puzzleContent: CellContentType[][];
  col: number;
  cells: CellType[];
}): CellContentType[][] => {
  const rowIndices: number[] = cells.map((cell) => cell.row);
  const uniqueRowIndices: number[] = Array.from(new Set(rowIndices));
  if (uniqueRowIndices.length !== 2) return puzzleContent;

  const [firstRow, secondRow]: [number, number] = uniqueRowIndices as [
    number,
    number
  ];
  if (Math.abs(firstRow - secondRow) !== 1) return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: firstRow, col: col - 1 } as CellType,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: firstRow, col: col + 1 } as CellType,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: secondRow, col: col - 1 } as CellType,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: secondRow, col: col + 1 } as CellType,
  });
  return newPuzzleContent;
};

const detectTwoAdjacentEmptyCellsInRow = ({
  puzzleContent,
  row,
  cells,
}: {
  puzzleContent: CellContentType[][];
  row: number;
  cells: CellType[];
}): CellContentType[][] => {
  const colIndices: number[] = cells.map((cell) => cell.col);
  const uniqueColIndices: number[] = Array.from(new Set(colIndices));
  if (uniqueColIndices.length !== 2) return puzzleContent;

  const [firstCol, secondCol] = uniqueColIndices as [number, number];
  if (Math.abs(firstCol - secondCol) !== 1) return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: row - 1, col: firstCol } as CellType,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: row + 1, col: firstCol } as CellType,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: row - 1, col: secondCol } as CellType,
  });
  newPuzzleContent = markNoFunction({
    puzzleContent: newPuzzleContent,
    cell: { row: row + 1, col: secondCol } as CellType,
  });
  return newPuzzleContent;
};

const detectTwoAdjacentEmptyCellsFunction = ({
  puzzleContent,
  color,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  color: ColorType;
  getEmptyCells: ({ color }: { color: ColorType }) => CellType[];
}): CellContentType[][] => {
  const emptyCells: CellType[] = getEmptyCells({ color });
  if (emptyCells.length !== 2) return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = detectTwoAdjacentEmptyCellsInCol({
    puzzleContent: newPuzzleContent,
    col: emptyCells[0].col,
    cells: emptyCells,
  });
  newPuzzleContent = detectTwoAdjacentEmptyCellsInRow({
    puzzleContent: newPuzzleContent,
    row: emptyCells[0].row,
    cells: emptyCells,
  });
  return newPuzzleContent;
};

export default detectTwoAdjacentEmptyCellsFunction;
