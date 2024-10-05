import { CellContentType, CellType } from "../types";
import { markNo } from "./markUtils";
import duplicatePuzzleContent from "./duplicatePuzzleContent";

const isCellInCells = ({
  cell,
  cells,
}: {
  cell: CellType;
  cells: CellType[];
}): boolean => {
  return cells.some((c) => c.row === cell.row && c.col === cell.col);
};

const are2CellsAdjacent = ({
  cell1,
  cell2,
}: {
  cell1: CellType;
  cell2: CellType;
}): boolean => {
  const rowDifference = Math.abs(cell1.row - cell2.row);
  const colDifference = Math.abs(cell1.col - cell2.col);
  if (rowDifference === 0 && colDifference === 0) return false;
  return rowDifference <= 1 && colDifference <= 1;
};

const cannotBeMarkedYesTogether = ({
  cell1,
  cell2,
}: {
  cell1: CellType;
  cell2: CellType;
}): boolean => {
  if (are2CellsAdjacent({ cell1, cell2 })) return true;
  if (cell1.row === cell2.row) return true;
  if (cell1.col === cell2.col) return true;
  return false;
};

const canCellBeMarkedNo = ({
  cell,
  emptyCells,
}: {
  cell: CellType;
  emptyCells: CellType[];
}): boolean => {
  let cannotBeMarkedYesTogetherCount: number = 0;
  emptyCells.forEach((emptyCell) => {
    if (cannotBeMarkedYesTogether({ cell1: cell, cell2: emptyCell }))
      cannotBeMarkedYesTogetherCount++;
  });
  return cannotBeMarkedYesTogetherCount === emptyCells.length;
};

const fillAllNoForColor = ({
  puzzleContent,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  const size: number = puzzleContent.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const currentCellContent = newPuzzleContent[i][j];
      if (currentCellContent !== null) continue;

      const currentCell: CellType = { row: i, col: j } as CellType;
      if (isCellInCells({ cell: currentCell, cells: emptyCells })) continue;

      if (
        canCellBeMarkedNo({
          cell: currentCell,
          emptyCells,
        })
      ) {
        newPuzzleContent = markNo({
          puzzleContent: newPuzzleContent,
          cell: currentCell,
        });
      }
    }
  }

  return newPuzzleContent;
};

export default fillAllNoForColor;
