import { CellContentType, CellType, ColorType } from "../types";
import { NO, YES } from "../constant";
import duplicatePuzzleContent from "./duplicatePuzzleContent";

const markGrid = ({
  puzzleContent,
  cell,
  content,
}: {
  puzzleContent: CellContentType[][];
  cell: CellType;
  content: CellContentType;
}): CellContentType[][] => {
  const newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent[cell.row][cell.col] = content;
  return newPuzzleContent;
};

export const markNo = ({
  puzzleContent,
  cell,
}: {
  puzzleContent: CellContentType[][];
  cell: CellType;
}): CellContentType[][] => {
  if (cell.row < 0 || cell.row >= puzzleContent.length) return puzzleContent;
  if (cell.col < 0 || cell.col >= puzzleContent[0].length) return puzzleContent;
  if (puzzleContent[cell.row][cell.col] === NO) return puzzleContent;
  if (puzzleContent[cell.row][cell.col] === YES) return puzzleContent;

  return markGrid({ puzzleContent, cell, content: NO });
};

const markSurroundingNo = ({
  puzzleContent,
  cell,
}: {
  puzzleContent: CellContentType[][];
  cell: CellType;
}): CellContentType[][] => {
  const size: number = puzzleContent.length;
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      const newRow: number = cell.row + i;
      const newCol: number = cell.col + j;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        newPuzzleContent = markNo({
          puzzleContent: newPuzzleContent,
          cell: { row: newRow, col: newCol } as CellType,
        });
      }
    }
  }
  return newPuzzleContent;
};

const markRowNo = ({
  puzzleContent,
  excludedCell,
}: {
  puzzleContent: CellContentType[][];
  excludedCell: CellType;
}): CellContentType[][] => {
  const row: number = excludedCell.row;
  const excludeCol: number = excludedCell.col;
  const size: number = puzzleContent.length;
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  for (let i = 0; i < size; i++) {
    if (i === excludeCol) continue;
    newPuzzleContent = markNo({
      puzzleContent: newPuzzleContent,
      cell: { row, col: i } as CellType,
    });
  }
  return newPuzzleContent;
};

const markColNo = ({
  puzzleContent,
  excludedCell,
}: {
  puzzleContent: CellContentType[][];
  excludedCell: CellType;
}): CellContentType[][] => {
  const col: number = excludedCell.col;
  const excludeRow: number = excludedCell.row;
  const size: number = puzzleContent.length;
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  for (let i = 0; i < size; i++) {
    if (i === excludeRow) continue;
    newPuzzleContent = markNo({
      puzzleContent: newPuzzleContent,
      cell: { row: i, col } as CellType,
    });
  }
  return newPuzzleContent;
};

const markAllOtherSameColorCellsNo = ({
  puzzleContent,
  color,
  excludedCell,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  color: string;
  excludedCell: CellType;
  getEmptyCells: ({ color }: { color: string }) => CellType[];
}): CellContentType[][] => {
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  const remainingEmptyCells: CellType[] = getEmptyCells({ color }).filter(
    (cell) => cell.row !== excludedCell.row || cell.col !== excludedCell.col
  );
  remainingEmptyCells.forEach(
    (cell) =>
      (newPuzzleContent = markNo({
        puzzleContent: newPuzzleContent,
        cell,
      }))
  );
  return newPuzzleContent;
};

export const markYes = ({
  puzzleContent,
  cell,
  puzzleColors,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  cell: CellType;
  puzzleColors: ColorType[][];
  getEmptyCells: ({ color }: { color: string }) => CellType[];
}): CellContentType[][] => {
  if (puzzleContent[cell.row][cell.col] === YES) return puzzleContent;

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });
  newPuzzleContent = markGrid({
    puzzleContent,
    cell,
    content: YES,
  });
  newPuzzleContent = markAllOtherSameColorCellsNo({
    puzzleContent: newPuzzleContent,
    color: puzzleColors[cell.row][cell.col] as string,
    excludedCell: cell,
    getEmptyCells,
  });
  newPuzzleContent = markSurroundingNo({
    puzzleContent: newPuzzleContent,
    cell,
  });
  newPuzzleContent = markRowNo({
    puzzleContent: newPuzzleContent,
    excludedCell: cell,
  });
  newPuzzleContent = markColNo({
    puzzleContent: newPuzzleContent,
    excludedCell: cell,
  });
  return newPuzzleContent;
};
