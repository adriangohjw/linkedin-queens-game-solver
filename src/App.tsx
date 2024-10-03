import { useState, useEffect, useCallback } from "react";
import { ColorType, CellType } from "./types";
import { COLOR_OPTIONS } from "./constant";
import {
  INITIAL_PUZZLE_OPTIONS,
  DEFAULT_SIZE,
  generateInitialBlankPuzzle,
} from "./InitialPuzzleOptions";
import RulesButton from "./RulesButton";
import LayoutTemplateButtons from "./LayoutTemplateButtons";
import StartingLayout from "./StartingLayout";
import SolvedLayout from "./SolvedLayout";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";

const initializePuzzleColors = (layout: number | null): ColorType[][] => {
  return layout === null
    ? generateInitialBlankPuzzle({ size: DEFAULT_SIZE })
    : INITIAL_PUZZLE_OPTIONS[layout].map((row) => [...row]);
};

export default function App() {
  const [layoutSelected, setLayoutSelected] = useState<number | null>(null);
  const [puzzleColors, setPuzzleColors] = useState<ColorType[][]>(
    initializePuzzleColors(layoutSelected)
  );
  const [selectedColor, setSelectedColor] = useState<ColorType>(
    COLOR_OPTIONS[0]
  );
  const size = puzzleColors.length;

  useEffect(() => {
    setPuzzleColors(initializePuzzleColors(layoutSelected));
  }, [layoutSelected]);

  const setPuzzleColor = useCallback(
    ({ cell }: { cell: CellType }): void => {
      setPuzzleColors((prev) => {
        const newGrid = [...prev];
        newGrid[cell.row][cell.col] = selectedColor;
        return newGrid;
      });
    },
    [selectedColor]
  );

  const clearBoard = ({ size }: { size?: number }): void => {
    setLayoutSelected(null);
    setPuzzleColors(generateInitialBlankPuzzle({ size: size ?? DEFAULT_SIZE }));
  };

  return (
    <div className="text-center m-4 p-4">
      <h1 className="text-3xl md:text-3xl text-2xl font-bold">
        LinkedIn Queens Game Solver
      </h1>
      <p className="mt-4 text-sm">
        Assumptions: The starting layout is correct.
      </p>
      <RulesButton />
      <div className="mt-4 max-w-[1200px] mx-auto">
        <div className="flex justify-center md:justify-start">
          <LayoutTemplateButtons
            layoutSelected={layoutSelected}
            setLayoutSelected={setLayoutSelected}
            clearBoard={clearBoard}
          />
        </div>
        <div className="justify-center items-center mt-2 h-full">
          <div className="flex-1 flex flex-col md:flex-row items-stretch">
            <StartingLayout
              key={`starting-${JSON.stringify(puzzleColors)}`}
              size={size}
              puzzleColors={puzzleColors}
              setPuzzleColor={setPuzzleColor}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              clearBoard={clearBoard}
            />
            <SolvedLayout
              key={`solved-${JSON.stringify(puzzleColors)}`}
              size={size}
              puzzleColors={puzzleColors}
            />
          </div>
        </div>
      </div>
      <Footer />
      <Disclaimer />
    </div>
  );
}
