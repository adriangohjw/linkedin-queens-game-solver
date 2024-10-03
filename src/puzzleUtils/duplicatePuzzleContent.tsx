import { CellContentType } from "../types";

const duplicatePuzzleContent = ({
  puzzleContent,
}: {
  puzzleContent: CellContentType[][];
}): CellContentType[][] => {
  return puzzleContent.map((row) => [...row]);
};

export default duplicatePuzzleContent;
