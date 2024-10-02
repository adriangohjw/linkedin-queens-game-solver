import { useState, useEffect } from "react";
import { YES, NO, YELLOW, BROWN, COLOR_OPTIONS } from "./constant";
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

  let colors: Record<string, { row: number; col: number }[]> =
    Object.fromEntries(COLOR_OPTIONS.map((color) => [color, []]));

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const color = puzzleColors[row][col];
      if (color) {
        colors[color].push({ row, col });
      }
    }
  }

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
    if (puzzleContent[row][col] === YES) {
      return;
    }
    markGrid({ row, col, content: YES });
    markSurroundingNo({ row, col });
    markRowNo({ row, excludeCol: col });
    markColNo({ col, excludeRow: row });
  }

  function markNo({ row, col }: { row: number; col: number }) {
    if (puzzleContent[row][col] === NO) {
      return;
    }
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
    const emptyCellIndices = puzzleContent[row]
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCellIndices.length === 0) return;

    const uniqueColors = new Set(
      emptyCellIndices
        .map((index) => puzzleColors[row][index])
        .filter((cell) => cell !== null)
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
    const emptyCellIndices = puzzleColors[col]
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCellIndices.length === 0) return;

    const uniqueColors = new Set(
      emptyCellIndices
        .map((index) => puzzleColors[index][col])
        .filter((cell) => cell !== null)
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

  function detectColorInSingleRowOrCol({ color }: { color: string }) {
    const cells = colors[color];

    const rowIndices = new Set(cells.map((cell) => cell.row));
    if (rowIndices.size === 1) {
      const row = rowIndices.values().next().value;
      if (typeof row === "number") {
        for (let i = 0; i < size; i++) {
          if (puzzleColors[row][i] !== color) {
            markNo({ row, col: i });
          }
        }
      }
    }

    const colIndices = new Set(cells.map((cell) => cell.col));
    if (colIndices.size === 1) {
      const col = colIndices.values().next().value;
      if (typeof col === "number") {
        for (let i = 0; i < size; i++) {
          if (puzzleColors[i][col] !== color) {
            markNo({ row: i, col });
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
      fillSingleEmptyCellInCol({ col: i });
      detectSingleColorRow({ row: i });
      detectSingleColorCol({ col: i });
    }

    Object.keys(colors).forEach((color) => {
      detectColorInSingleRowOrCol({ color });
    });
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
