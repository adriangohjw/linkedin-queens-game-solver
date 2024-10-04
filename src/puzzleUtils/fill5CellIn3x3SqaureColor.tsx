import { CellContentType, CellType } from "../types";
import { markNo } from "./markUtils";
import {
  getUniqueRowIndices,
  getUniqueColIndices,
  are2CellsAdjacent,
  isCellInCells,
} from "./util";

// Assuming in 3x3 grid,
// the center cell is the second cell in the sorted row and col indices
const getCenterCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType => {
  return {
    row: getUniqueRowIndices({
      cells: emptyCells,
    })[1],
    col: getUniqueColIndices({
      cells: emptyCells,
    })[1],
  } as CellType;
};

const isValid5CellNoCenterShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const consecutive3Numbers = ({ numbers }: { numbers: number[] }): boolean => {
    if (numbers.length !== 3) return false;
    if (Math.abs(numbers[0] - numbers[1]) !== 1) return false;
    if (Math.abs(numbers[1] - numbers[2]) !== 1) return false;
    return true;
  };

  const isValidRowIndices: boolean = consecutive3Numbers({
    numbers: getUniqueRowIndices({
      cells: emptyCells,
    }),
  });
  if (!isValidRowIndices) return false;

  const isValidColIndices: boolean = consecutive3Numbers({
    numbers: getUniqueColIndices({
      cells: emptyCells,
    }),
  });
  if (!isValidColIndices) return false;

  return !isCellInCells({
    cell: getCenterCell({ emptyCells }),
    cells: emptyCells,
  });
};

const isValid5CellZigZagShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): { isValid: boolean; cell: CellType | null } => {
  const centerCell: CellType = getCenterCell({
    emptyCells,
  });

  const isCenterCellInEmptyCells: boolean = isCellInCells({
    cell: centerCell,
    cells: emptyCells,
  });
  if (!isCenterCellInEmptyCells) return { isValid: false, cell: null };

  const cellsIn4Corners: CellType[] = [
    { row: centerCell.row - 1, col: centerCell.col - 1 },
    { row: centerCell.row - 1, col: centerCell.col + 1 },
    { row: centerCell.row + 1, col: centerCell.col - 1 },
    { row: centerCell.row + 1, col: centerCell.col + 1 },
  ];
  let adjacentCountMap: Record<number, CellType[]> = {};

  cellsIn4Corners.forEach((cellInCorner) => {
    let numberOfAdjacentEmptyCells: number = 0;
    emptyCells.forEach((emptyCell) => {
      if (are2CellsAdjacent({ cell1: cellInCorner, cell2: emptyCell })) {
        numberOfAdjacentEmptyCells++;
      }
    });
    adjacentCountMap[numberOfAdjacentEmptyCells] =
      adjacentCountMap[numberOfAdjacentEmptyCells] || [];
    adjacentCountMap[numberOfAdjacentEmptyCells].push(cellInCorner);
  });

  const isValid: boolean =
    adjacentCountMap[1]?.length === 1 &&
    adjacentCountMap[2]?.length === 2 &&
    adjacentCountMap[3]?.length === 1;
  if (!isValid) return { isValid: false, cell: null };

  return { isValid, cell: adjacentCountMap[3][0] };
};

const fill5CellIn3x3SqaureColor = ({
  puzzleContent,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  if (emptyCells.length !== 5) return puzzleContent;

  const valid5CellNoCenterShape: boolean = isValid5CellNoCenterShape({
    emptyCells,
  });
  if (valid5CellNoCenterShape) {
    return markNo({
      puzzleContent,
      cell: getCenterCell({ emptyCells }),
    });
  }

  const valid5CellZigZagShape: {
    isValid: boolean;
    cell: CellType | null;
  } = isValid5CellZigZagShape({
    emptyCells,
  });
  if (valid5CellZigZagShape.isValid) {
    return markNo({
      puzzleContent,
      cell: valid5CellZigZagShape.cell as CellType,
    });
  }

  return puzzleContent;
};

export default fill5CellIn3x3SqaureColor;
