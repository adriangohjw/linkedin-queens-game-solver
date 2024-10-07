import { CellContentType, CellType, ColorType } from "../types";
import { generateColors } from "./util";
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

  const getEmptyCellsForColor = ({
    color,
  }: {
    color: ColorType;
  }): CellType[] => {
    const cells: CellType[] = colors[color as string];
    return cells.filter((cell) => puzzleContent[cell.row][cell.col] === null);
  };

  let newPuzzleContent: CellContentType[][] = puzzleContent;

  for (let i = 0; i < puzzleColors.length; i++) {
    newPuzzleContent = fill1EmptyCellInRow({
      puzzleContent: newPuzzleContent,
      row: i,
      puzzleColors,
      getEmptyCells: getEmptyCellsForColor,
    });
    newPuzzleContent = fill1EmptyCellInCol({
      puzzleContent: newPuzzleContent,
      col: i,
      puzzleColors,
      getEmptyCells: getEmptyCellsForColor,
    });
  }

  Object.entries(colors).forEach(([color, cells]) => {
    if (cells.length === 0) return;

    const emptyCells: CellType[] = getEmptyCellsForColor({
      color: color,
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
