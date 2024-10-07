import { CellContentType, ColorType, CellType } from "../types";
import { markYes } from "./markUtils";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import fillPuzzle from "./fillPuzzle";
import { areTwoPuzzlesSame } from "./util";

export const getAllEmptyCellsUtil = ({
  puzzleContent,
}: {
  puzzleContent: CellContentType[][];
}): CellType[] => {
  return puzzleContent
    .flatMap((row, rowIndex) =>
      row.map((cell, colIndex) =>
        cell === null ? { row: rowIndex, col: colIndex } : null
      )
    )
    .filter((cell): cell is CellType => cell !== null);
};

const fillByTrialAndError = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}): CellContentType[][] => {
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  const allEmptyCells: CellType[] = getAllEmptyCellsUtil({ puzzleContent });

  for (let i = 0; i < allEmptyCells.length; i++) {
    let attemptedSolution: CellContentType[][] = markYes({
      puzzleContent: newPuzzleContent,
      puzzleColors,
      cell: allEmptyCells[i],
    });
    attemptedSolution = fillPuzzle({
      puzzleContent: attemptedSolution,
      puzzleColors,
    });
    if (!areTwoPuzzlesSame(puzzleContent, attemptedSolution)) {
      return attemptedSolution;
    }
  }

  return newPuzzleContent;
};

export default fillByTrialAndError;
