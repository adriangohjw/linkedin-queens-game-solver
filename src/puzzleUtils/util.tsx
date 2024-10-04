import { ColorType, CellContentType, CellType } from "../types";
import { YES, COLOR_OPTIONS } from "../constant";

export const generateEmptyPuzzleContent = ({
  size,
}: {
  size: number;
}): CellContentType[][] => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );
};

export const generateColors = ({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: ColorType[][];
}): Record<string, CellType[]> => {
  let colors: Record<string, CellType[]> = Object.fromEntries(
    COLOR_OPTIONS.map((color) => [color, []])
  );

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const color: ColorType = puzzleColors[row][col];
      if (color) {
        colors[color].push({ row, col });
      }
    }
  }

  return colors;
};

export const generateTotalCellsCount = ({ size }: { size: number }): number => {
  return size * size;
};

export const generatePuzzleColorsFilledCount = ({
  puzzleColors,
}: {
  puzzleColors: ColorType[][];
}): number => {
  return puzzleColors.flat().filter((color) => color !== null).length;
};

export const generateUniquePuzzleColorsCount = ({
  colors,
}: {
  colors: Record<string, CellType[]>;
}): number => {
  return Object.keys(colors).filter((color) => colors[color].length > 0).length;
};

export const generateIsSolved = ({
  size,
  puzzleContent,
}: {
  size: number;
  puzzleContent: CellContentType[][];
}): boolean => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (puzzleContent[i][j] === null) return false;
    }
  }

  // check every row only one YES
  for (let i = 0; i < size; i++) {
    const yesCount: number = puzzleContent[i].filter(
      (cell) => cell === YES
    ).length;
    if (yesCount !== 1) return false;
  }

  // check every col has only one YES
  for (let j = 0; j < size; j++) {
    const yesCount: number = puzzleContent
      .map((row) => row[j])
      .filter((cell) => cell === YES).length;
    if (yesCount !== 1) return false;
  }

  const yesCells: CellType[] = puzzleContent
    .flatMap((row, rowIndex) =>
      row.map((cell, colIndex) =>
        cell === YES ? { row: rowIndex, col: colIndex } : undefined
      )
    )
    .filter((cell): cell is CellType => cell !== undefined);
  if (yesCells.length !== size) return false;

  for (let n = 0; n < yesCells.length - 1; n++) {
    const currentCell: CellType = yesCells[n];
    if (currentCell === null) return false;

    const nextCell: CellType | null = yesCells[n + 1];
    if (nextCell === null) return false;

    if (Math.abs(currentCell.col - nextCell.col) <= 1) {
      return false;
    }
  }

  return true;
};

export const getEmptyCellsUtil = ({
  colors,
  puzzleContent,
  color,
}: {
  colors: Record<string, CellType[]>;
  puzzleContent: CellContentType[][];
  color: ColorType;
}): CellType[] => {
  const cells: CellType[] = colors[color as string];
  return cells.filter((cell) => puzzleContent[cell.row][cell.col] === null);
};

export const getRowIndices = ({ cells }: { cells: CellType[] }): number[] => {
  return cells.map((cell) => cell.row).sort((a, b) => a - b);
};

export const getUniqueRowIndices = ({
  cells,
}: {
  cells: CellType[];
}): number[] => {
  return Array.from(new Set(getRowIndices({ cells }))).sort((a, b) => a - b);
};

export const getColIndices = ({ cells }: { cells: CellType[] }): number[] => {
  return cells.map((cell) => cell.col).sort((a, b) => a - b);
};

export const getUniqueColIndices = ({
  cells,
}: {
  cells: CellType[];
}): number[] => {
  return Array.from(new Set(getColIndices({ cells }))).sort((a, b) => a - b);
};

export const are2CellsAdjacent = ({
  cell1,
  cell2,
}: {
  cell1: CellType;
  cell2: CellType;
}): boolean => {
  const rowDifference = Math.abs(cell1.row - cell2.row);
  const colDifference = Math.abs(cell1.col - cell2.col);
  return rowDifference <= 1 && colDifference <= 1;
};

export const getRowsAndCols = ({
  cells,
}: {
  cells: CellType[];
}): Record<number, number[]> => {
  const rowColMap: Record<number, number[]> = {};

  cells.forEach((cell) => {
    if (!rowColMap[cell.row]) {
      rowColMap[cell.row] = [];
    }
    rowColMap[cell.row].push(cell.col);
  });

  Object.keys(rowColMap).forEach((row) => {
    rowColMap[+row].sort((a, b) => a - b);
  });

  return rowColMap;
};

export const getColsAndRows = ({
  cells,
}: {
  cells: CellType[];
}): Record<number, number[]> => {
  const rowColMap: Record<number, number[]> = {};

  cells.forEach((cell) => {
    if (!rowColMap[cell.col]) {
      rowColMap[cell.col] = [];
    }
    rowColMap[cell.col].push(cell.row);
  });

  Object.keys(rowColMap).forEach((col) => {
    rowColMap[+col].sort((a, b) => a - b);
  });

  return rowColMap;
};
