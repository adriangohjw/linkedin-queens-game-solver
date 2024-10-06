import { CellContentType, ColorType } from "../../types";
import generateUnfilledColorRowsAndColsMap from "./generateUnfilledColorRowsAndColsMap";

const generateUnfilledColorCols = ({
  puzzleContent,
  puzzleColors,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
}): Record<string, number[]> => {
  const unfilledColorRowsAndCols: Record<
    string,
    { rows: number[]; cols: number[] }
  > = generateUnfilledColorRowsAndColsMap({
    puzzleContent,
    puzzleColors,
  });
  return Object.fromEntries(
    Object.keys(unfilledColorRowsAndCols).map((color) => [
      color,
      unfilledColorRowsAndCols[color].cols,
    ])
  );
};

const generateUnfilledNColorPermutationsForCols = ({
  puzzleContent,
  puzzleColors,
  N,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  N: number;
}): { colors: string[]; cols: number[] }[] => {
  const unfilledColorCols: Record<string, number[]> = generateUnfilledColorCols(
    {
      puzzleContent,
      puzzleColors,
    }
  );
  const colorCombinations: { [key: string]: number[] } = {};

  const generateCombinations = (
    colors: string[],
    start: number,
    current: string[]
  ) => {
    if (current.length === N) {
      const key = current.join(",");
      const cols = Array.from(
        new Set(current.flatMap((color) => unfilledColorCols[color]))
      ).sort((a, b) => a - b);
      colorCombinations[key] = cols;
      return;
    }

    for (let i = start; i < colors.length; i++) {
      current.push(colors[i]);
      generateCombinations(colors, i + 1, current);
      current.pop();
    }
  };

  const colors = Object.keys(unfilledColorCols);
  generateCombinations(colors, 0, []);

  return Object.entries(colorCombinations).map(
    ([colorCombination, colIndices]) => ({
      colors: colorCombination.split(","),
      cols: colIndices,
    })
  );
};

export default generateUnfilledNColorPermutationsForCols;
