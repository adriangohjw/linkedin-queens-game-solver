import { CellContentType, CellType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { generateColors, getEmptyCellsForColor } from "./util";
import fill1EmptyCellInRow from "./fill1EmptyCellInRow";
import fill1EmptyCellInCol from "./fill1EmptyCellInCol";
import fillAllNoForColor from "./fillAllNoForColor";
import fillMultiLinesPermutation from "./fillMultiLinesPermutation";

const fillPuzzle = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}): CellContentType[][] => {
  const colors: Record<string, CellType[]> = generateColors({
    puzzleColors,
  });

  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  for (let i = 0; i < puzzleColors.length; i++) {
    newPuzzleContent = fill1EmptyCellInRow({
      puzzleContent: newPuzzleContent,
      row: i,
      puzzleColors,
    });
    newPuzzleContent = fill1EmptyCellInCol({
      puzzleContent: newPuzzleContent,
      col: i,
      puzzleColors,
    });
  }

  Object.entries(colors).forEach(([color, cells]) => {
    if (cells.length === 0) return;

    const emptyCells: CellType[] = getEmptyCellsForColor({
      puzzleContent: newPuzzleContent,
      puzzleColors,
      color,
    });
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
