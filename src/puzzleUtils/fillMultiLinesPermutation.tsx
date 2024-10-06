import { CellContentType, ColorType } from "../types";
import duplicatePuzzleContent from "./duplicatePuzzleContent";
import fillNShapeInNRows from "./fillMultiLinesPermutation/fillNShapeInNRows";
import fillNShapeInNCols from "./fillMultiLinesPermutation/fillNShapeInNCols";

const fillMultiLinesPermutation = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}) => {
  let newPuzzleContent: CellContentType[][] = duplicatePuzzleContent({
    puzzleContent,
  });

  newPuzzleContent = fillNShapeInNRows({
    puzzleContent: newPuzzleContent,
    puzzleColors,
  });

  newPuzzleContent = fillNShapeInNCols({
    puzzleContent: newPuzzleContent,
    puzzleColors,
  });

  return newPuzzleContent;
};

export default fillMultiLinesPermutation;
