import { CellContentType, CellType, ColorType } from "../../types";
import { markNo } from "../markUtils";
import duplicatePuzzleContent from "../duplicatePuzzleContent";
import generateUnfilledNColorPermutationsForRows from "./generateUnfilledNColorPermutationsForRows";
import generateArrayPermutations from "./generateArrayPermutations";

const generateUnfilledRowIndices = ({
  puzzleContent,
}: {
  puzzleContent: CellContentType[][];
}): number[] => {
  return puzzleContent
    .map((row, rowIndex) => (row.some((cell) => cell === null) ? rowIndex : -1))
    .filter((index) => index !== -1);
};

const fillNShapeInNRows = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}): CellContentType[][] => {
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  const unfilledRowIndices: number[] = generateUnfilledRowIndices({
    puzzleContent,
  });

  for (let i = 1; i < puzzleContent.length; i++) {
    const NPermutations: number[][] = generateArrayPermutations({
      arr: unfilledRowIndices,
      N: i,
    });
    const unfilledNColorPermutationsForRows =
      generateUnfilledNColorPermutationsForRows({
        puzzleContent: newPuzzleContent,
        puzzleColors,
        N: i,
      });
    // eslint-disable-next-line no-loop-func
    NPermutations.forEach((rowPermutation) => {
      unfilledNColorPermutationsForRows.forEach((colorPermutationHash) => {
        const canColorsFit =
          JSON.stringify(rowPermutation) ===
          JSON.stringify(colorPermutationHash.rows);
        if (!canColorsFit) return;

        rowPermutation.forEach((rowIndex) => {
          newPuzzleContent[rowIndex].forEach((_, colIndex) => {
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

export default fillNShapeInNRows;
