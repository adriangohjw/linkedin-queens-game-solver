import { useState, useEffect } from "react";
import { YES, NO } from "./constant";
import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function SolvedLayout({ size }: { size: number }) {
  const [puzzleContent, setPuzzleContent] = useState<(string | null)[][]>(
    Array.from({ length: size }, () => Array.from({ length: size }, () => null))
  );

  function markGrid({
    row,
    col,
    content,
  }: {
    row: number;
    col: number;
    content: string;
  }) {
    setPuzzleContent((prev) => {
      const newGrid = [...prev];
      newGrid[row][col] = content;
      return newGrid;
    });
  }

  function markYes({ row, col }: { row: number; col: number }) {
    markGrid({ row, col, content: YES });
    markSurroundingNo({ row, col });
    markRowNo({ row, excludeCol: col });
    markColNo({ col, excludeRow: row });
  }

  function markNo({ row, col }: { row: number; col: number }) {
    markGrid({ row, col, content: NO });
  }

  function markSurroundingNo({ row, col }: { row: number; col: number }) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
          markNo({ row: newRow, col: newCol });
        }
      }
    }
  }

  function markRowNo({ row, excludeCol }: { row: number; excludeCol: number }) {
    for (let i = 0; i < size; i++) {
      if (i === excludeCol) continue;
      markNo({ row, col: i });
    }
  }

  function markColNo({ col, excludeRow }: { col: number; excludeRow: number }) {
    for (let i = 0; i < size; i++) {
      if (i === excludeRow) continue;
      markNo({ row: i, col });
    }
  }

  const isSolved = () => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (puzzleContent[i][j] === null) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    markYes({ row: 0, col: 0 });
    markYes({ row: 6, col: 6 });
    markYes({ row: 4, col: 3 });
  }, []);

  return (
    <Layout title="Solved Layout">
      <Puzzle size={size} content={puzzleContent} isSolved={isSolved()} />
    </Layout>
  );
}
