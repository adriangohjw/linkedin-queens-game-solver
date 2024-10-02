import { useState, useEffect } from "react";
import { YES, NO } from "./constant";
import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function SolvedLayout({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: (string | null)[][];
}) {
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

  function fillSingleEmptyCellInRow({ row }: { row: number }) {
    const currentRowContent = puzzleContent[row];

    const emptyCellIndices = currentRowContent
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCellIndices.length === 1) {
      markYes({ row, col: emptyCellIndices[0] });
    }
  }

  function fillSingleEmptyCellInCol({ col }: { col: number }) {
    const currentColContent = puzzleContent.map((row) => row[col]);

    const emptyCellIndices = currentColContent
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCellIndices.length === 1) {
      markYes({ row: emptyCellIndices[0], col });
    }
  }

  function detectSingleColorRow({ row }: { row: number }) {
    const currentRowContent = puzzleColors[row];
    const uniqueColors = new Set(
      currentRowContent.filter((cell) => cell !== null)
    );
    if (uniqueColors.size === 1) {
      const color = uniqueColors.values().next().value;
      if (color) {
        // markNoForColorExceptRow
        for (let i = 0; i < size; i++) {
          if (i !== row) {
            for (let j = 0; j < size; j++) {
              if (puzzleColors[i][j] === color) {
                markNo({ row: i, col: j });
              }
            }
          }
        }
      }
    }
  }

  function detectSingleColorCol({ col }: { col: number }) {
    const currentColContent = puzzleColors.map((row) => row[col]);
    const uniqueColors = new Set(
      currentColContent.filter((cell) => cell !== null)
    );
    if (uniqueColors.size === 1) {
      const color = uniqueColors.values().next().value;
      if (color) {
        // markNoForColorExceptCol
        for (let i = 0; i < size; i++) {
          if (i !== col) {
            for (let j = 0; j < size; j++) {
              if (puzzleColors[j][i] === color) {
                markNo({ row: j, col: i });
              }
            }
          }
        }
      }
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
    for (let i = 0; i < size; i++) {
      fillSingleEmptyCellInRow({ row: i });
      detectSingleColorRow({ row: i });
    }

    for (let i = 0; i < size; i++) {
      fillSingleEmptyCellInCol({ col: i });
      detectSingleColorCol({ col: i });
    }
  }, [puzzleContent]);

  return (
    <Layout title="Solved Layout">
      <Puzzle
        size={size}
        content={puzzleContent}
        isSolved={isSolved()}
        colors={puzzleColors}
      />
    </Layout>
  );
}
