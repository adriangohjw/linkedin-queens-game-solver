import { CellContentType, CellType, ColorType } from "../types";
import { generateColors } from "./util";
import fill1EmptyCellInRow from "./fill1EmptyCellInRow";
import fill1EmptyCellInCol from "./fill1EmptyCellInCol";
import fillAllNoForColor from "./fillAllNoForColor";
import fillMultiLinesPermutation from "./fillMultiLinesPermutation";

const fillPuzzle = ({
  puzzleContent,
  puzzleColors,
  getEmptyCells,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  getEmptyCells: ({ color }: { color: string }) => CellType[];
}): CellContentType[][] => {
  let newPuzzleContent: CellContentType[][] = puzzleContent;

  for (let i = 0; i < puzzleColors.length; i++) {
    newPuzzleContent = fill1EmptyCellInRow({
      puzzleContent: newPuzzleContent,
      row: i,
      puzzleColors,
      getEmptyCells,
    });
    newPuzzleContent = fill1EmptyCellInCol({
      puzzleContent: newPuzzleContent,
      col: i,
      puzzleColors,
      getEmptyCells,
    });
  }

  const colors: Record<string, CellType[]> = generateColors({
    puzzleColors,
  });
  Object.entries(colors).forEach(([color, cells]) => {
    if (cells.length === 0) return;

    const emptyCells: CellType[] = getEmptyCells({ color });
    if (emptyCells.length === 0) return;

    newPuzzleContent = fillAllNoForColor({
      puzzleContent: newPuzzleContent,
      emptyCells,
    });
  });

  newPuzzleContent = fillMultiLinesPermutation({
    puzzleContent: newPuzzleContent,
    puzzleColors,
  });

  return newPuzzleContent;
};

export default fillPuzzle;
