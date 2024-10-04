import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { markNo } from "./markUtils";
import { getUniqueRowIndices, getUniqueColIndices } from "./util";

const detectThreeAdjacentEmptyCellsInRow = ({
  puzzleContent,
  row,
  cells,
}: {
  puzzleContent: CellContentType[][];
  row: number;
  cells: CellType[];
}): CellContentType[][] => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({ cells });
  if (uniqueRowIndices.length !== 1) return puzzleContent;

  const uniqueColIndices: number[] = getUniqueColIndices({ cells });
  if (uniqueColIndices.length !== 3) return puzzleContent;

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
  const uniqueColIndices = getUniqueColIndices({ cells });
  if (uniqueColIndices.length !== 1) return puzzleContent;

  const uniqueRowIndices: number[] = getUniqueRowIndices({ cells });
  if (uniqueRowIndices.length !== 3) return puzzleContent;

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

const fill3AdjacentEmptyCells = ({
  puzzleContent,
  color,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  color: ColorType;
  emptyCells: CellType[];
}): CellContentType[][] => {
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

export default fill3AdjacentEmptyCells;
