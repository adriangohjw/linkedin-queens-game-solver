import { useState, useEffect, useCallback } from "react";
import { CellType, CellContentType, ColorType } from "./types";
import {
  generateEmptyPuzzleContent,
  generateColors,
  generateTotalCellsCount,
  generatePuzzleColorsFilledCount,
  generateIsSolved,
  generateUniquePuzzleColorsCount,
  getEmptyCellsUtil,
} from "./puzzleUtils/util";
import fill1EmptyCellInRow from "./puzzleUtils/fill1EmptyCellInRow";
import fill1EmptyCellInCol from "./puzzleUtils/fill1EmptyCellInCol";
import fillAllNoForColor from "./puzzleUtils/fillAllNoForColor";
import fillMultiLinesPermutation from "./puzzleUtils/fillMultiLinesPermutation";
import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function SolvedLayout({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: ColorType[][];
}) {
  const [puzzleContent, setPuzzleContent] = useState<CellContentType[][]>(
    generateEmptyPuzzleContent({ size })
  );

  const colors: Record<string, CellType[]> = generateColors({
    puzzleColors,
  });

  const totalCellsCount: number = generateTotalCellsCount({ size });
  const puzzleColorsFilledCount: number = generatePuzzleColorsFilledCount({
    puzzleColors,
  });
  const isAllPuzzleColorsFilled: boolean =
    puzzleColorsFilledCount === totalCellsCount;

  const uniquePuzzleColorsCount: number = generateUniquePuzzleColorsCount({
    colors,
  });
  const correctPuzzleColorsCount: boolean = size === uniquePuzzleColorsCount;

  const getEmptyCells = useCallback(
    ({ color }: { color: ColorType }): CellType[] => {
      if (!isAllPuzzleColorsFilled) return [];

      return getEmptyCellsUtil({ colors, puzzleContent, color });
    },
    [colors, puzzleContent, isAllPuzzleColorsFilled]
  );

  const isSolved: boolean = generateIsSolved({
    puzzleContent,
    puzzleColors,
  });

  useEffect(() => {
    if (isSolved) return;

    let newPuzzleContent: CellContentType[][] = puzzleContent;

    for (let i = 0; i < size; i++) {
      newPuzzleContent = fill1EmptyCellInRow({
        puzzleContent: newPuzzleContent,
        row: i,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = fill1EmptyCellInCol({
        puzzleContent: newPuzzleContent,
        col: i,
        puzzleColors,
        getEmptyCells,
      });
    }

    Object.entries(colors).forEach(([color, cells]) => {
      if (cells.length === 0) return;

      const emptyCells: CellType[] = getEmptyCells({ color });
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

    if (JSON.stringify(puzzleContent) === JSON.stringify(newPuzzleContent))
      return;

    setPuzzleContent(newPuzzleContent);
  }, [colors, getEmptyCells, isSolved, puzzleColors, puzzleContent, size]);

  const renderMessage = (): JSX.Element | null => {
    if (isSolved)
      return <p className="text-4xl text-green-500 font-bold">Solved 🥳</p>;

    if (isAllPuzzleColorsFilled) {
      if (!correctPuzzleColorsCount)
        return (
          <p className="text-lg text-red-500 font-bold">
            Incorrect number of colors
            <br />
            <i>
              ({uniquePuzzleColorsCount} / {size})
            </i>
          </p>
        );
    } else {
      return (
        <p className="text-lg text-red-500 font-bold">
          Incorrect number of colors
          <br />
          <i>
            ({uniquePuzzleColorsCount} / {size})
          </i>
        </p>
      );
    }

    return null;
  };

  return (
    <Layout title="Solved Layout">
      <Puzzle
        size={size}
        content={
          isAllPuzzleColorsFilled && correctPuzzleColorsCount
            ? puzzleContent
            : undefined
        }
        isSolved={isSolved}
        colors={puzzleColors}
      />
      {renderMessage()}
    </Layout>
  );
}
