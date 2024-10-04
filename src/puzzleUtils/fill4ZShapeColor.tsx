import { CellContentType, CellType } from "../types";
import { markNo } from "./markUtils";
import {
  getRowIndices,
  getUniqueRowIndices,
  getColIndices,
  getUniqueColIndices,
  isConsecutiveNumbers,
  are2CellsAdjacent,
} from "./util";

const splitArrayInto2Arrays = ({ array }: { array: number[] }): number[][] => {
  const mid: number = Math.floor(array.length / 2);
  return [array.slice(0, mid), array.slice(mid)];
};

const create2SetsOfDiagonalCorners = ({
  indices1,
  indices2,
}: {
  indices1: number[];
  indices2: number[];
}): CellType[][] => {
  return [
    [
      { row: indices1[0], col: indices2[0] } as CellType,
      {
        row: indices1[indices1.length - 1],
        col: indices2[indices2.length - 1],
      } as CellType,
    ],
    [
      {
        row: indices1[0],
        col: indices2[indices2.length - 1],
      } as CellType,
      {
        row: indices1[indices1.length - 1],
        col: indices2[0],
      } as CellType,
    ],
  ];
};

const isValidVerticalZShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices = getUniqueRowIndices({ cells: emptyCells });
  const uniqueColIndices = getUniqueColIndices({ cells: emptyCells });
  if (uniqueRowIndices.length !== 3) return false;
  if (uniqueColIndices.length !== 2) return false;

  if (
    !isConsecutiveNumbers({
      numbers: uniqueRowIndices,
      length: 3,
    }) ||
    !isConsecutiveNumbers({
      numbers: uniqueColIndices,
      length: 2,
    })
  )
    return false;

  const [colIndices1, colIndices2] = splitArrayInto2Arrays({
    array: getColIndices({ cells: emptyCells }),
  });
  const [rowIndices1, rowIndices2] = splitArrayInto2Arrays({
    array: getRowIndices({ cells: emptyCells }),
  });
  if (Array.from(new Set(colIndices1)).length !== 1) return false;
  if (Array.from(new Set(colIndices2)).length !== 1) return false;
  if (Array.from(new Set(rowIndices1)).length === 1) return false;
  if (Array.from(new Set(rowIndices2)).length === 1) return false;
  return true;
};

const isValidHorizontalZShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices = getUniqueRowIndices({ cells: emptyCells });
  const uniqueColIndices = getUniqueColIndices({ cells: emptyCells });
  if (uniqueRowIndices.length !== 2) return false;
  if (uniqueColIndices.length !== 3) return false;
  if (
    !isConsecutiveNumbers({
      numbers: uniqueRowIndices,
      length: 2,
    }) ||
    !isConsecutiveNumbers({
      numbers: uniqueColIndices,
      length: 3,
    })
  )
    return false;

  const [colIndices1, colIndices2] = splitArrayInto2Arrays({
    array: getColIndices({ cells: emptyCells }),
  });
  const [rowIndices1, rowIndices2] = splitArrayInto2Arrays({
    array: getRowIndices({ cells: emptyCells }),
  });
  if (Array.from(new Set(rowIndices1)).length !== 1) return false;
  if (Array.from(new Set(rowIndices2)).length !== 1) return false;
  if (Array.from(new Set(colIndices1)).length === 1) return false;
  if (Array.from(new Set(colIndices2)).length === 1) return false;
  return true;
};

const getFillableCells = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType[] => {
  const [diagonalCorner1, diagonalCorner2]: CellType[][] =
    create2SetsOfDiagonalCorners({
      indices1: getUniqueRowIndices({ cells: emptyCells }),
      indices2: getUniqueColIndices({ cells: emptyCells }),
    });

  const [diagonalCorner1Cell1, diagonalCorner1Cell2]: CellType[] =
    diagonalCorner1;

  const diagonalCorner1Cell1AdjacencyCount: number = emptyCells.reduce(
    (count, cell) => {
      return (
        (count || 0) +
        (are2CellsAdjacent({ cell1: diagonalCorner1Cell1, cell2: cell })
          ? 1
          : 0)
      );
    },
    0
  );
  const diagonalCorner1Cell2AdjacencyCount: number = emptyCells.reduce(
    (count, cell) => {
      return (
        (count || 0) +
        (are2CellsAdjacent({ cell1: diagonalCorner1Cell2, cell2: cell })
          ? 1
          : 0)
      );
    },
    0
  );
  return diagonalCorner1Cell1AdjacencyCount ===
    diagonalCorner1Cell2AdjacencyCount &&
    [2, 3].includes(diagonalCorner1Cell1AdjacencyCount)
    ? diagonalCorner1
    : diagonalCorner2;
};

const isValidZShape = ({ emptyCells }: { emptyCells: CellType[] }): boolean => {
  return (
    isValidVerticalZShape({ emptyCells }) ||
    isValidHorizontalZShape({ emptyCells })
  );
};

const fill4ZShapeColor = ({
  puzzleContent,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  if (emptyCells.length !== 4) return puzzleContent;

  if (!isValidZShape({ emptyCells })) return puzzleContent;

  const fillableCells: CellType[] = getFillableCells({
    emptyCells,
  });
  fillableCells.forEach((cell) => {
    puzzleContent = markNo({
      puzzleContent,
      cell,
    });
  });

  return puzzleContent;
};

export default fill4ZShapeColor;
