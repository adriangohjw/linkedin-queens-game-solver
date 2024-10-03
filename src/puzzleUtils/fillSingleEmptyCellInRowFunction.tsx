import { CellContentType, CellType, ColorType } from "../types";
import { markYesFunction } from "./markUtils";

const fillSingleEmptyCellInRowFunction = ({
  puzzleContent,
  row,
  puzzleColors,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  row: number;
  puzzleColors: ColorType[][];
  getEmptyCells: ({ color }: { color: string }) => CellType[];
}): CellContentType[][] => {
  const currentRowContent: CellContentType[] = puzzleContent[row];

  const emptyCellIndices: number[] = currentRowContent
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCellIndices.length === 1) {
    return markYesFunction({
      puzzleContent,
      cell: { row, col: emptyCellIndices[0] } as CellType,
      puzzleColors,
      getEmptyCells,
    });
  }
  return puzzleContent;
};

export default fillSingleEmptyCellInRowFunction;
