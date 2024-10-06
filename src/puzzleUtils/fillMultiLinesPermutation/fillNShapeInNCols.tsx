import { CellContentType, CellType, ColorType } from "../../types";
import { markNo } from "../markUtils";
import duplicatePuzzleContent from "../duplicatePuzzleContent";
import generateUnfilledNColorPermutationsForCols from "./generateUnfilledNColorPermutationsForCols";
import generateArrayPermutations from "./generateArrayPermutations";

const generateUnfilledColIndices = ({
  puzzleContent,
}: {
  puzzleContent: CellContentType[][];
}): number[] => {
  const isColUnfilled = (colIndex: number): boolean => {
    for (let rowIndex = 0; rowIndex < puzzleContent.length; rowIndex++) {
      if (puzzleContent[rowIndex][colIndex] == null) {
        return true;
      }
    }
    return false;
  };

  const result: number[] = [];
  for (let colIndex = 0; colIndex < puzzleContent.length; colIndex++) {
    if (isColUnfilled(colIndex)) {
      result.push(colIndex);
    }
  }
  return result;
};

const fillNShapeInNCols = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}) => {
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  const unfilledColIndices: number[] = generateUnfilledColIndices({
    puzzleContent: newPuzzleContent,
  });

  for (let i = 1; i < puzzleContent.length; i++) {
    const NPermutations: number[][] = generateArrayPermutations({
      arr: unfilledColIndices,
      N: i,
    });
    const unfilledNColorPermutationsForCols =
      generateUnfilledNColorPermutationsForCols({
        puzzleContent: newPuzzleContent,
        puzzleColors,
        N: i,
      });
    // eslint-disable-next-line no-loop-func
    NPermutations.forEach((colPermutation) => {
      unfilledNColorPermutationsForCols.forEach((colorPermutationHash) => {
        const canColorsFit =
          JSON.stringify(colPermutation) ===
          JSON.stringify(colorPermutationHash.cols);
        if (!canColorsFit) return;

        colPermutation.forEach((colIndex) => {
          newPuzzleContent[colIndex].forEach((_, rowIndex) => {
            const cellColor: ColorType = puzzleColors[rowIndex][colIndex];
            if (
              cellColor !== null &&
              !colorPermutationHash.colors.includes(cellColor)
            ) {
              newPuzzleContent = markNo({
                puzzleContent: newPuzzleContent,
                cell: { row: rowIndex, col: colIndex } as CellType,
              });
            }
          });
        });
      });
    });
  }

  return newPuzzleContent;
};

export default fillNShapeInNCols;
