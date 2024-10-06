import { CellContentType, ColorType } from "../../types";
import generateUnfilledColorRowsAndColsMap from "./generateUnfilledColorRowsAndColsMap";

const generateUnfilledColorRows = ({
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
      unfilledColorRowsAndCols[color].rows,
    ])
  );
};

const generateUnfilledNColorPermutationsForRows = ({
  puzzleContent,
  puzzleColors,
  N,
}: {
  puzzleContent: CellContentType[][];
  puzzleColors: ColorType[][];
  N: number;
}): { colors: string[]; rows: number[] }[] => {
  const unfilledColorRows: Record<string, number[]> = generateUnfilledColorRows(
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
      const rows = Array.from(
        new Set(current.flatMap((color) => unfilledColorRows[color]))
      ).sort((a, b) => a - b);
      colorCombinations[key] = rows;
      return;
    }

    for (let i = start; i < colors.length; i++) {
      current.push(colors[i]);
      generateCombinations(colors, i + 1, current);
      current.pop();
    }
  };

  const colors = Object.keys(unfilledColorRows);
  generateCombinations(colors, 0, []);

  return Object.entries(colorCombinations).map(
    ([colorCombination, rowIndices]) => ({
      colors: colorCombination.split(","),
      rows: rowIndices,
    })
  );
};

export default generateUnfilledNColorPermutationsForRows;
