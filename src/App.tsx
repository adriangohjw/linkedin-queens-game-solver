import { useState } from "react";
import INITIAL_PUZZLE_COLOR from "./InitialPuzzleColor";
import RulesButton from "./RulesButton";
import StartingLayout from "./StartingLayout";
import SolvedLayout from "./SolvedLayout";
import Footer from "./Footer";
import Disclaimer from "./Disclaimer";

export default function App() {
  const size = 8;

  const [puzzleColors, setPuzzleColors] =
    useState<(string | null)[][]>(INITIAL_PUZZLE_COLOR);

  function setPuzzleColor({
    row,
    col,
    color,
  }: {
    row: number;
    col: number;
    color: string | null;
  }) {
    setPuzzleColors((prev) => {
      const newGrid = [...prev];
      newGrid[row][col] = color;
      return newGrid;
    });
  }

  return (
    <div className="text-center m-4 p-4">
      <h1 className="text-3xl md:text-3xl text-2xl font-bold">
        LinkedIn Queens Game Solver
      </h1>
      <p className="mt-4 text-sm">
        Assumptions: The starting layout is correct.
      </p>
      <RulesButton />
      <div className="flex flex-col md:flex-row justify-center items-center mt-4">
        <StartingLayout size={size} puzzleColors={puzzleColors} />
        <SolvedLayout size={size} puzzleColors={puzzleColors} />
      </div>
      <Footer />
      <Disclaimer />
    </div>
  );
}
