import { CellContentType, ColorType, CellType } from "../types";
import { markNo } from "./markUtils";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import { generateIsSolved } from "./util";
import fillPuzzle from "./fillPuzzle";

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
  allEmptyCells.forEach((cell) => {
    const tempPuzzleContent: CellContentType[][] = markNo({
      puzzleContent: newPuzzleContent,
      cell,
    });
    const attemptedSolution: CellContentType[][] = fillPuzzle({
      puzzleContent: tempPuzzleContent,
      puzzleColors,
    });
    if (generateIsSolved({ puzzleContent: attemptedSolution, puzzleColors })) {
      newPuzzleContent = attemptedSolution;
    }
  });

  return newPuzzleContent;
};

export default fillByTrialAndError;
