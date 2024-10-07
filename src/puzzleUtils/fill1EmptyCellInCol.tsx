import { CellContentType, CellType, ColorType } from "../types";
import { markYes } from "./markUtils";

const fill1EmptyCellInCol = ({
  puzzleContent,
  col,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  col: number;
  puzzleColors: ColorType[][];
}): CellContentType[][] => {
  const currentColContent: CellContentType[] = puzzleContent.map(
    (row) => row[col]
  );

  const emptyCellIndices: number[] = currentColContent
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCellIndices.length === 1) {
    return markYes({
      puzzleContent,
      cell: { row: emptyCellIndices[0], col } as CellType,
      puzzleColors,
    });
  }
  return puzzleContent;
};

export default fill1EmptyCellInCol;
