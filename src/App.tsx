import { useState, useEffect, useCallback } from "react";
import { ColorType, CellType } from "./types";
import { COLOR_OPTIONS } from "./constant";
import INITIAL_PUZZLE_OPTIONS from "./InitialPuzzleOptions";
import RulesButton from "./RulesButton";
import LayoutTemplateButtons from "./LayoutTemplateButtons";
import StartingLayout from "./StartingLayout";
import SolvedLayout from "./SolvedLayout";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";

export default function App() {
  const [layoutSelected, setLayoutSelected] = useState<number | null>(2);
  const [puzzleColors, setPuzzleColors] = useState<ColorType[][]>(
    INITIAL_PUZZLE_OPTIONS[layoutSelected as unknown as number]
  );
  const [selectedColor, setSelectedColor] = useState<ColorType>(
    COLOR_OPTIONS[0]
  );

  useEffect(() => {
    layoutSelected !== null &&
      setPuzzleColors(INITIAL_PUZZLE_OPTIONS[layoutSelected]);
  }, [layoutSelected]);

  const size = puzzleColors.length;

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

  return (
    <div className="text-center m-4 p-4">
      <h1 className="text-3xl md:text-3xl text-2xl font-bold">
        LinkedIn Queens Game Solver
      </h1>
      <p className="mt-4 text-sm">
        Assumptions: The starting layout is correct.
      </p>
      <RulesButton />
      <div className="mt-4">
        <div className="flex justify-center md:justify-start">
          <LayoutTemplateButtons
            layoutSelected={layoutSelected}
            setLayoutSelected={setLayoutSelected}
          />
        </div>
        <div className="justify-center items-center mt-2 h-full">
          <div className="flex-1 flex flex-col md:flex-row items-stretch">
            <StartingLayout
              size={size}
              puzzleColors={puzzleColors}
              setPuzzleColor={setPuzzleColor}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
            <SolvedLayout
              key={JSON.stringify(puzzleColors)}
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
