import { CellContentType, CellType } from "../types";
import { markNo } from "./markUtils";
import { getUniqueRowIndices, getUniqueColIndices } from "./util";

const getRowAndColCountMap = ({ emptyCells }: { emptyCells: CellType[] }) => {
  const result: Record<number, number> = {};
  for (const cell of emptyCells) {
    result[cell.row] = (result[cell.row] || 0) + 1;
  }
  return result;
};

const getColAndRowCountMap = ({ emptyCells }: { emptyCells: CellType[] }) => {
  const result: Record<number, number> = {};
  for (const cell of emptyCells) {
    result[cell.col] = (result[cell.col] || 0) + 1;
  }
  return result;
};

const isStartsWithLargestNumber = ({ arr }: { arr: number[] }) => {
  return arr[0] !== 1 && arr.slice(1).every((num) => num === 1);
};

const isEndsWithLargestNumber = ({ arr }: { arr: number[] }) => {
  return (
    arr[arr.length - 1] !== 1 && arr.slice(0, -1).every((num) => num === 1)
  );
};

const isValidVerticalTShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({ cells: emptyCells });
  if (uniqueRowIndices.length < 2) return false;

  const uniqueColIndices: number[] = getUniqueColIndices({ cells: emptyCells });
  if (uniqueColIndices.length !== 3) return false;

  const colAndRowCountArray = Object.entries(
    getColAndRowCountMap({
      emptyCells,
    })
  ).map(([col, count]) => ({ col: Number(col), count }));
  if (colAndRowCountArray[0].count !== 1) return false;
  if (colAndRowCountArray[1].count < 2) return false;
  if (colAndRowCountArray[2].count !== 1) return false;

  const rowAndColCountArray: number[] = Object.values(
    getRowAndColCountMap({
      emptyCells,
    })
  );
  const startsWithLargestNumber = isStartsWithLargestNumber({
    arr: rowAndColCountArray,
  });
  const endsWithLargestNumber = isEndsWithLargestNumber({
    arr: rowAndColCountArray,
  });

  return startsWithLargestNumber || endsWithLargestNumber;
};

const isValidHorizontalTShape = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): boolean => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({ cells: emptyCells });
  if (uniqueRowIndices.length !== 3) return false;

  const uniqueColIndices: number[] = getUniqueColIndices({ cells: emptyCells });
  if (uniqueColIndices.length < 2) return false;

  const rowAndColCountArray = Object.entries(
    getRowAndColCountMap({
      emptyCells,
    })
  ).map(([row, count]) => ({ row: Number(row), count }));
  if (rowAndColCountArray[0].count !== 1) return false;
  if (rowAndColCountArray[1].count < 2) return false;
  if (rowAndColCountArray[2].count !== 1) return false;

  const colAndRowCountArray = Object.values(
    getColAndRowCountMap({
      emptyCells,
    })
  );
  const startsWithLargestNumber = isStartsWithLargestNumber({
    arr: colAndRowCountArray,
  });
  const endsWithLargestNumber = isEndsWithLargestNumber({
    arr: colAndRowCountArray,
  });

  return startsWithLargestNumber || endsWithLargestNumber;
};

const getVerticalTShapeFillableCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType => {
  const uniqueColIndices: number[] = getUniqueColIndices({ cells: emptyCells });
  const col = uniqueColIndices[1];

  const rowAndColCountMap: Record<number, number> = getRowAndColCountMap({
    emptyCells,
  });

  const rowWithLargestColCount: number = Number(
    Object.entries(rowAndColCountMap).reduce(
      (prev, curr) => (curr[1] > prev[1] ? curr : prev),
      ["", 0] as [string, number]
    )[0]
  );

  return isStartsWithLargestNumber({
    arr: Object.values(rowAndColCountMap),
  })
    ? ({ row: rowWithLargestColCount - 1, col } as CellType)
    : ({ row: rowWithLargestColCount + 1, col } as CellType);
};

const getHorizontalTShapeFillableCell = ({
  emptyCells,
}: {
  emptyCells: CellType[];
}): CellType => {
  const uniqueRowIndices: number[] = getUniqueRowIndices({ cells: emptyCells });
  const row = uniqueRowIndices[1];

  const colAndRowCountMap: Record<number, number> = getColAndRowCountMap({
    emptyCells,
  });

  const colWithLargestRowCount: number = Number(
    Object.entries(colAndRowCountMap).reduce(
      (prev, curr) => (curr[1] > prev[1] ? curr : prev),
      ["", 0] as [string, number]
    )[0]
  );

  return isStartsWithLargestNumber({
    arr: Object.values(colAndRowCountMap),
  })
    ? ({ row, col: colWithLargestRowCount - 1 } as CellType)
    : ({ row, col: colWithLargestRowCount + 1 } as CellType);
};

const fillTShapeColor = ({
  puzzleContent,
  emptyCells,
}: {
  puzzleContent: CellContentType[][];
  emptyCells: CellType[];
}): CellContentType[][] => {
  if (isValidVerticalTShape({ emptyCells })) {
    return markNo({
      puzzleContent,
      cell: getVerticalTShapeFillableCell({ emptyCells }),
    });
  }

  if (isValidHorizontalTShape({ emptyCells })) {
    return markNo({
      puzzleContent,
      cell: getHorizontalTShapeFillableCell({ emptyCells }),
    });
  }

  return puzzleContent;
};

export default fillTShapeColor;
