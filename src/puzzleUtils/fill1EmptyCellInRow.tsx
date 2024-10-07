import { CellContentType, CellType, ColorType } from "../types";
import { markYes } from "./markUtils";

const fill1EmptyCellInRow = ({
  puzzleContent,
  row,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  row: number;
  puzzleColors: ColorType[][];
}): CellContentType[][] => {
  const currentRowContent: CellContentType[] = puzzleContent[row];

  const emptyCellIndices: number[] = currentRowContent
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCellIndices.length === 1) {
    return markYes({
      puzzleContent,
      cell: { row, col: emptyCellIndices[0] } as CellType,
      puzzleColors,
    });
  }
  return puzzleContent;
};

export default fill1EmptyCellInRow;
