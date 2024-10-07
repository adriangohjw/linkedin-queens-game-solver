import { useState, useEffect } from "react";
import { CellType, CellContentType, ColorType } from "./types";
import {
  generateEmptyPuzzleContent,
  generateColors,
  generateTotalCellsCount,
  generatePuzzleColorsFilledCount,
  generateIsSolved,
  generateUniquePuzzleColorsCount,
  areTwoPuzzlesSame,
} from "./puzzleUtils/util";
import fillPuzzle from "./puzzleUtils/fillPuzzle";
import fillByTrialAndError from "./puzzleUtils/fillByTrialAndError";
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

  const isSolved: boolean = generateIsSolved({
    puzzleContent,
    puzzleColors,
  });

  useEffect(() => {
    if (isSolved) return;
    if (!isAllPuzzleColorsFilled) return;

    let newPuzzleContent: CellContentType[][] = fillPuzzle({
      puzzleContent,
      puzzleColors,
    });

    if (areTwoPuzzlesSame(puzzleContent, newPuzzleContent)) {
      const attemptedSolution: CellContentType[][] = fillByTrialAndError({
        puzzleContent,
        puzzleColors,
      });
      if (areTwoPuzzlesSame(newPuzzleContent, attemptedSolution)) return;

      newPuzzleContent = attemptedSolution;
    }

    setPuzzleContent(newPuzzleContent);
  }, [isSolved, puzzleColors, puzzleContent, isAllPuzzleColorsFilled]);

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
          Please fill up starting layout
          <br />
          <i>
            ({puzzleColorsFilledCount} / {totalCellsCount})
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
