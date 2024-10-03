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
import fillSingleEmptyCellInRow from "./puzzleUtils/fillSingleEmptyCellInRow";
import fillSingleEmptyCellInCol from "./puzzleUtils/fillSingleEmptyCellInCol";
import detectSingleColorRow from "./puzzleUtils/detectSingleColorRow";
import detectSingleColorCol from "./puzzleUtils/detectSingleColorCol";
import detectIfColorInSingleRowOrCol from "./puzzleUtils/detectIfColorInSingleRowOrCol";
import detectTwoAdjacentEmptyCells from "./puzzleUtils/detectTwoAdjacentEmptyCells";
import detectThreeAdjacentEmptyCells from "./puzzleUtils/detectThreeAdjacentEmptyCells";
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
    size,
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
      return getEmptyCellsUtil(
        colors,
        puzzleContent,
        isAllPuzzleColorsFilled,
        color
      );
    },
    [colors, puzzleContent, isAllPuzzleColorsFilled]
  );

  const isSolved = (): boolean => generateIsSolved({ size, puzzleContent });

  useEffect(() => {
    let newPuzzleContent: CellContentType[][] = puzzleContent;
    for (let i = 0; i < size; i++) {
      newPuzzleContent = fillSingleEmptyCellInRow({
        puzzleContent: newPuzzleContent,
        row: i,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = fillSingleEmptyCellInCol({
        puzzleContent: newPuzzleContent,
        col: i,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = detectSingleColorRow({
        puzzleContent: newPuzzleContent,
        row: i,
        puzzleColors,
      });
      newPuzzleContent = detectSingleColorCol({
        puzzleContent: newPuzzleContent,
        col: i,
        puzzleColors,
      });
    }

    Object.keys(colors).forEach((color) => {
      newPuzzleContent = detectIfColorInSingleRowOrCol({
        color,
        puzzleContent: newPuzzleContent,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = detectTwoAdjacentEmptyCells({
        puzzleContent: newPuzzleContent,
        color,
        getEmptyCells,
      });
      newPuzzleContent = detectThreeAdjacentEmptyCells({
        puzzleContent: newPuzzleContent,
        color,
        getEmptyCells,
      });
    });
    setPuzzleContent(newPuzzleContent);
  }, [colors, getEmptyCells, puzzleColors, puzzleContent, size]);

  return (
    <Layout title="Solved Layout">
      <Puzzle
        size={size}
        content={
          isAllPuzzleColorsFilled && correctPuzzleColorsCount
            ? puzzleContent
            : undefined
        }
        isSolved={isSolved()}
        colors={puzzleColors}
      />
      {isSolved() && (
        <p className="text-4xl text-green-500 font-bold">Solved 🥳</p>
      )}
      {!isAllPuzzleColorsFilled && (
        <p className="text-lg text-red-500 font-bold">
          Please fill up starting layout
          <br />
          <i>
            ({puzzleColorsFilledCount} / {totalCellsCount})
          </i>
        </p>
      )}
      {isAllPuzzleColorsFilled && !correctPuzzleColorsCount && (
        <p className="text-lg text-red-500 font-bold">
          Incorrect number of colors
          <br />
          <i>
            ({uniquePuzzleColorsCount} / {size})
          </i>
        </p>
      )}
    </Layout>
  );
}
