import { CellContentType, CellType, ColorType } from "../types";
import { markYesFunction } from "./markUtils";

const fillSingleEmptyCellInColFunction = ({
  puzzleContent,
  col,
  puzzleColors,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  col: number;
  puzzleColors: ColorType[][];
  getEmptyCells: ({ color }: { color: string }) => CellType[];
}): CellContentType[][] => {
  const currentColContent: CellContentType[] = puzzleContent.map(
    (row) => row[col]
  );

  const emptyCellIndices: number[] = currentColContent
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyCellIndices.length === 1) {
    return markYesFunction({
      puzzleContent,
      cell: { row: emptyCellIndices[0], col } as CellType,
      puzzleColors,
      getEmptyCells,
    });
  }
  return puzzleContent;
};

export default fillSingleEmptyCellInColFunction;
