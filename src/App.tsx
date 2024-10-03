import { useState } from "react";
import { ColorType, CellType } from "./types";
import INITIAL_PUZZLE_OPTIONS from "./InitialPuzzleOptions";
import RulesButton from "./RulesButton";
import LayoutTemplateButtons from "./LayoutTemplateButtons";
import StartingLayout from "./StartingLayout";
import SolvedLayout from "./SolvedLayout";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";

export default function App() {
  const [puzzleColors, setPuzzleColors] = useState<ColorType[][]>(
    INITIAL_PUZZLE_OPTIONS[2]
  );

  const size = puzzleColors.length;

  const setPuzzleColor = ({
    cell,
    color,
  }: {
    cell: CellType;
    color: ColorType;
  }): void => {
    setPuzzleColors((prev) => {
      const newGrid = [...prev];
      newGrid[cell.row][cell.col] = color;
      return newGrid;
    });
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
      <div className="mt-4">
        <div className="flex justify-center md:justify-start">
          <LayoutTemplateButtons setPuzzleColors={setPuzzleColors} />
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-2">
          <StartingLayout size={size} puzzleColors={puzzleColors} />
          <SolvedLayout
            key={JSON.stringify(puzzleColors)}
            size={size}
            puzzleColors={puzzleColors}
          />
        </div>
      </div>
      <Footer />
      <Disclaimer />
    </div>
  );
}
