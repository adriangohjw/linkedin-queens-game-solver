import { CellContentType, CellType } from "../types";
import { markNo } from "./markUtils";
import {
  getUniqueRowIndices,
  getUniqueColIndices,
  are2CellsAdjacent,
  getRowsAndCols,
  getColsAndRows,
} from "./util";

const isValid3LShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({
    cells: emptyCells,
  });
  if (uniqueRowIndices.length !== 2) return false;
  if (Math.abs(uniqueRowIndices[0] - uniqueRowIndices[1]) !== 1) return false;

  const uniqueColIndices: number[] = getUniqueColIndices({
    cells: emptyCells,
  });
  if (uniqueColIndices.length !== 2) return false;
  if (Math.abs(uniqueColIndices[0] - uniqueColIndices[1]) !== 1) return false;

  return true;
};

const getCorneredCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({
    cells: emptyCells,
  });
  const uniqueColIndices: number[] = getUniqueColIndices({
    cells: emptyCells,
  });
  const fourCells: CellType[] = [
    { row: uniqueRowIndices[0], col: uniqueColIndices[0] } as CellType,
    { row: uniqueRowIndices[0], col: uniqueColIndices[1] } as CellType,
    { row: uniqueRowIndices[1], col: uniqueColIndices[0] } as CellType,
    { row: uniqueRowIndices[1], col: uniqueColIndices[1] } as CellType,
  ];

  return fourCells.filter(
    (cell) =>
      !emptyCells.some(
        (emptyCell) => emptyCell.row === cell.row && emptyCell.col === cell.col
      )
  )[0];
};

const getRowExtendedCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType => {
  const rowColMap: Record<number, number[]> = getRowsAndCols({
    cells: emptyCells,
  });

  const rowWith2Cols: number = Object.keys(rowColMap)
    .map(Number)
    .find((key) => rowColMap[key].length === 2) as number;

  const sortedColsInRowWith2Cols: number[] = rowColMap[rowWith2Cols].sort(
    (a, b) => a - b
  );

  const cellsExtendingRowsWith2Cols: CellType[] = [
    { row: rowWith2Cols, col: sortedColsInRowWith2Cols[0] - 1 } as CellType,
    { row: rowWith2Cols, col: sortedColsInRowWith2Cols[1] + 1 } as CellType,
  ];

  const rowWith1Col: number = Object.keys(rowColMap)
    .map(Number)
    .find((key) => rowColMap[key].length === 1) as number;

  const cellExtendingRowWith1Col: CellType = {
    row: rowWith1Col,
    col: rowColMap[rowWith1Col][0],
  } as CellType;

  return are2CellsAdjacent({
    cell1: cellExtendingRowWith1Col,
    cell2: cellsExtendingRowsWith2Cols[0],
  })
    ? cellsExtendingRowsWith2Cols[0]
    : cellsExtendingRowsWith2Cols[1];
};

const getColExtendedCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType => {
  const colRowMap: Record<number, number[]> = getColsAndRows({
    cells: emptyCells,
  });

  const colWith2Rows: number = Object.keys(colRowMap)
    .map(Number)
    .find((key) => colRowMap[key].length === 2) as number;

  const sortedRowsInColWith2Rows: number[] = colRowMap[colWith2Rows].sort(
    (a, b) => a - b
  );

  const cellsExtendingColsWith2Rows: CellType[] = [
    { row: sortedRowsInColWith2Rows[0] - 1, col: colWith2Rows } as CellType,
    { row: sortedRowsInColWith2Rows[1] + 1, col: colWith2Rows } as CellType,
  ];

  const colWith1Row: number = Object.keys(colRowMap)
    .map(Number)
    .find((key) => colRowMap[key].length === 1) as number;

  const cellExtendingColWith1Row: CellType = {
    row: colRowMap[colWith1Row][0],
    col: colWith1Row,
  } as CellType;

  return are2CellsAdjacent({
    cell1: cellExtendingColWith1Row,
    cell2: cellsExtendingColsWith2Rows[0],
  })
    ? cellsExtendingColsWith2Rows[0]
    : cellsExtendingColsWith2Rows[1];
};

const getFillableCells = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType[] => {
  return [
    getCorneredCell({ emptyCells }),
    getRowExtendedCell({ emptyCells }),
    getColExtendedCell({ emptyCells }),
  ];
};

const fill3LShapeColor = ({
  puzzleContent,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  if (emptyCells.length !== 3) return puzzleContent;

  const valid3LShape: boolean = isValid3LShape({
    emptyCells,
  });
  if (!valid3LShape) return puzzleContent;

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

export default fill3LShapeColor;
