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
import fillSingleEmptyCellInRowFunction from "./puzzleUtils/fillSingleEmptyCellInRowFunction";
import fillSingleEmptyCellInColFunction from "./puzzleUtils/fillSingleEmptyCellInColFunction";
import detectSingleColorRowFunction from "./puzzleUtils/detectSingleColorRowFunction";
import detectSingleColorColFunction from "./puzzleUtils/detectSingleColorColFunction";
import detectIfColorInSingleRowOrColFunction from "./puzzleUtils/detectIfColorInSingleRowOrColFunction";
import detectTwoAdjacentEmptyCellsFunction from "./puzzleUtils/detectTwoAdjacentEmptyCellsFunction";
import detectThreeAdjacentEmptyCellsFunction from "./puzzleUtils/detectThreeAdjacentEmptyCellsFunction";
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
      newPuzzleContent = fillSingleEmptyCellInRowFunction({
        puzzleContent: newPuzzleContent,
        row: i,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = fillSingleEmptyCellInColFunction({
        puzzleContent: newPuzzleContent,
        col: i,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = detectSingleColorRowFunction({
        puzzleContent: newPuzzleContent,
        row: i,
        puzzleColors,
      });
      newPuzzleContent = detectSingleColorColFunction({
        puzzleContent: newPuzzleContent,
        col: i,
        puzzleColors,
      });
    }

    Object.keys(colors).forEach((color) => {
      newPuzzleContent = detectIfColorInSingleRowOrColFunction({
        color,
        puzzleContent: newPuzzleContent,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = detectTwoAdjacentEmptyCellsFunction({
        puzzleContent: newPuzzleContent,
        color,
        getEmptyCells,
      });
      newPuzzleContent = detectThreeAdjacentEmptyCellsFunction({
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
