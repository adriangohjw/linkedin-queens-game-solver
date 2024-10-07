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
  puzzleColors,
}: {
  puzzleColors: ColorType[][];
}): Record<string, CellType[]> => {
  const size: number = puzzleColors.length;

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
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}): boolean => {
  const size: number = puzzleContent.length;

  if (
    generateUniquePuzzleColorsCount({
      colors: generateColors({ puzzleColors }),
    }) !== size
  )
    return false;

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

export const getEmptyCellsForColor = ({
  puzzleContent,
  puzzleColors,
  color,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  color: ColorType;
}): CellType[] => {
  if (color === null) return [];

  const colors: Record<string, CellType[]> = generateColors({
    puzzleColors,
  });
  const cells: CellType[] = colors[color as string];
  return cells.filter((cell) => puzzleContent[cell.row][cell.col] === null);
};
