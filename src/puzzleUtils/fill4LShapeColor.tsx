import { CellContentType, CellType } from "../types";
import { markNo } from "./markUtils";
import {
  getUniqueColIndices,
  getUniqueRowIndices,
  are2CellsAdjacent,
  create2SetsOfDiagonalCorners,
} from "./util";

const generate2x3Grid = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType[] => {
  let result: CellType[] = [];
  const uniqueRowIndices: number[] = getUniqueRowIndices({ cells: emptyCells });
  const uniqueColIndices: number[] = getUniqueColIndices({ cells: emptyCells });
  for (let i = 0; i < uniqueRowIndices.length; i++) {
    for (let j = 0; j < uniqueColIndices.length; j++) {
      result.push({ row: uniqueRowIndices[i], col: uniqueColIndices[j] });
    }
  }
  return result;
};

const had3CornersInEmptyCells = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  let numberOfCornerCellsInEmptyCells: number = 0;
  const cornerCells: CellType[] = create2SetsOfDiagonalCorners({
    indices1: getUniqueRowIndices({
      cells: emptyCells,
    }),
    indices2: getUniqueColIndices({
      cells: emptyCells,
    }),
  }).flat(Infinity) as CellType[];
  cornerCells.forEach((cornerCell) => {
    if (
      emptyCells.some(
        (emptyCell) =>
          emptyCell.row === cornerCell.row && emptyCell.col === cornerCell.col
      )
    ) {
      numberOfCornerCellsInEmptyCells++;
    }
  });
  return numberOfCornerCellsInEmptyCells === 3;
};

const isValidVertical4LShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({
    cells: emptyCells,
  });
  if (uniqueRowIndices.length !== 3) return false;

  const uniqueColIndices: number[] = getUniqueColIndices({
    cells: emptyCells,
  });
  if (uniqueColIndices.length !== 2) return false;

  return true;
};

const isValidHorizontal4LShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({
    cells: emptyCells,
  });
  if (uniqueRowIndices.length !== 2) return false;

  const uniqueColIndices: number[] = getUniqueColIndices({
    cells: emptyCells,
  });
  if (uniqueColIndices.length !== 3) return false;

  return true;
};

const isValid4LShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  return (
    had3CornersInEmptyCells({ emptyCells }) &&
    (isValidVertical4LShape({ emptyCells }) ||
      isValidHorizontal4LShape({ emptyCells }))
  );
};

const getFillableCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType | undefined => {
  const grid: CellType[] = generate2x3Grid({ emptyCells });
  for (const cell of grid) {
    const notInEmptyCells = !emptyCells.some(
      (emptyCell) => emptyCell.row === cell.row && emptyCell.col === cell.col
    );
    if (!notInEmptyCells) continue;

    let numberOfAdjacentCells: number = 0;
    for (const emptyCell of emptyCells) {
      if (are2CellsAdjacent({ cell1: cell, cell2: emptyCell })) {
        numberOfAdjacentCells++;
      }
    }
    if (numberOfAdjacentCells === emptyCells.length) return cell;
  }
};

const fill4LShapeColor = ({
  puzzleContent,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  if (emptyCells.length !== 4) return puzzleContent;

  if (!isValid4LShape({ emptyCells })) return puzzleContent;

  const fillableCell: CellType | undefined = getFillableCell({
    emptyCells,
  });
  if (!fillableCell) return puzzleContent;

  return markNo({
    puzzleContent,
    cell: fillableCell,
  });
};

export default fill4LShapeColor;
