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
import fill1ColorRow from "./puzzleUtils/fill1ColorRow";
import fill1ColorCol from "./puzzleUtils/fill1ColorCol";
import fillColorInSingleRowOrCol from "./puzzleUtils/fillColorInSingleRowOrCol";
import fill2AdjacentEmptyCells from "./puzzleUtils/fill2AdjacentEmptyCells";
import fill3AdjacentEmptyCells from "./puzzleUtils/fill3AdjacentEmptyCells";
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
      newPuzzleContent = fill1ColorRow({
        puzzleContent: newPuzzleContent,
        row: i,
        puzzleColors,
      });
      newPuzzleContent = fill1ColorCol({
        puzzleContent: newPuzzleContent,
        col: i,
        puzzleColors,
      });
    }

    Object.keys(colors).forEach((color) => {
      newPuzzleContent = fillColorInSingleRowOrCol({
        color,
        puzzleContent: newPuzzleContent,
        puzzleColors,
        getEmptyCells,
      });
      newPuzzleContent = fill2AdjacentEmptyCells({
        puzzleContent: newPuzzleContent,
        color,
        getEmptyCells,
      });
      newPuzzleContent = fill3AdjacentEmptyCells({
        puzzleContent: newPuzzleContent,
        color,
        getEmptyCells,
      });
    });

    if (JSON.stringify(puzzleContent) === JSON.stringify(newPuzzleContent))
      return;
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
