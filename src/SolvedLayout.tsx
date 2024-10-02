import { useState, useEffect, useCallback } from "react";
import { YES, NO, COLOR_OPTIONS } from "./constant";
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

  const markGrid = useCallback(
    ({ row, col, content }: { row: number; col: number; content: string }) => {
      setPuzzleContent((prev) => {
        const newGrid = [...prev];
        newGrid[row][col] = content;
        return newGrid;
      });
    },
    []
  );

  const markNo = useCallback(
    ({ row, col }: { row: number; col: number }) => {
      if (puzzleContent[row][col] === NO) {
        return;
      }
      markGrid({ row, col, content: NO });
    },
    [puzzleContent, markGrid]
  );

  const markSurroundingNo = useCallback(
    ({ row, col }: { row: number; col: number }) => {
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
    },
    [markNo, size]
  );

  const markRowNo = useCallback(
    ({ row, excludeCol }: { row: number; excludeCol: number }) => {
      for (let i = 0; i < size; i++) {
        if (i === excludeCol) continue;
        markNo({ row, col: i });
      }
    },
    [markNo, size]
  );

  const markColNo = useCallback(
    ({ col, excludeRow }: { col: number; excludeRow: number }) => {
      for (let i = 0; i < size; i++) {
        if (i === excludeRow) continue;
        markNo({ row: i, col });
      }
    },
    [markNo, size]
  );

  const markYes = useCallback(
    ({ row, col }: { row: number; col: number }) => {
      if (puzzleContent[row][col] === YES) {
        return;
      }
      markGrid({ row, col, content: YES });
      markSurroundingNo({ row, col });
      markRowNo({ row, excludeCol: col });
      markColNo({ col, excludeRow: row });
    },
    [puzzleContent, markGrid, markSurroundingNo, markRowNo, markColNo]
  );

  const fillSingleEmptyCellInRow = useCallback(
    ({ row }: { row: number }) => {
      const currentRowContent = puzzleContent[row];

      const emptyCellIndices = currentRowContent
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCellIndices.length === 1) {
        markYes({ row, col: emptyCellIndices[0] });
      }
    },
    [puzzleContent, markYes]
  );

  const fillSingleEmptyCellInCol = useCallback(
    ({ col }: { col: number }) => {
      const currentColContent = puzzleContent.map((row) => row[col]);

      const emptyCellIndices = currentColContent
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCellIndices.length === 1) {
        markYes({ row: emptyCellIndices[0], col });
      }
    },
    [puzzleContent, markYes]
  );

  const detectSingleColorRow = useCallback(
    ({ row }: { row: number }) => {
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
    },
    [puzzleContent, puzzleColors, size, markNo]
  );

  const detectSingleColorCol = useCallback(
    ({ col }: { col: number }) => {
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
    },
    [puzzleColors, size, markNo]
  );

  const detectColorInSingleRowOrCol = useCallback(
    ({ color }: { color: string }) => {
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
    },
    [colors, puzzleColors, size, markNo]
  );

  const getEmptyCells = useCallback(
    ({ color }: { color: string }) => {
      const cells = colors[color];
      return cells.filter((cell) => puzzleContent[cell.row][cell.col] === null);
    },
    [colors, puzzleContent]
  );

  const detectTwoAdjacentEmptyCellsInRow = useCallback(
    ({
      row,
      cells,
    }: {
      row: number;
      cells: { row: number; col: number }[];
    }) => {
      const colIndices = cells.map((cell) => cell.col);
      const uniqueColIndices = Array.from(new Set(colIndices));
      if (uniqueColIndices.length !== 2) return;

      const [firstCol, secondCol] = uniqueColIndices;
      if (Math.abs(firstCol - secondCol) !== 1) return;

      markNo({ row: row - 1, col: firstCol });
      markNo({ row: row + 1, col: firstCol });
      markNo({ row: row - 1, col: secondCol });
      markNo({ row: row + 1, col: secondCol });
    },
    [markNo]
  );

  const detectTwoAdjacentEmptyCellsInCol = useCallback(
    ({
      col,
      cells,
    }: {
      col: number;
      cells: { row: number; col: number }[];
    }) => {
      const rowIndices = cells.map((cell) => cell.row);
      const uniqueRowIndices = Array.from(new Set(rowIndices));
      if (uniqueRowIndices.length !== 2) return;

      const [firstRow, secondRow] = uniqueRowIndices;
      if (Math.abs(firstRow - secondRow) !== 1) return;

      markNo({ row: firstRow, col: col - 1 });
      markNo({ row: firstRow, col: col + 1 });
      markNo({ row: secondRow, col: col - 1 });
      markNo({ row: secondRow, col: col + 1 });
    },
    [markNo]
  );

  const detectTwoAdjacentEmptyCells = useCallback(
    ({ color }: { color: string }) => {
      const emptyCells = getEmptyCells({ color });
      if (emptyCells.length !== 2) return;

      detectTwoAdjacentEmptyCellsInCol({
        col: emptyCells[0].col,
        cells: emptyCells,
      });
      detectTwoAdjacentEmptyCellsInRow({
        row: emptyCells[0].row,
        cells: emptyCells,
      });
    },
    [
      getEmptyCells,
      detectTwoAdjacentEmptyCellsInCol,
      detectTwoAdjacentEmptyCellsInRow,
    ]
  );

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
      detectTwoAdjacentEmptyCells({ color });
    });
  }, [
    colors,
    detectColorInSingleRowOrCol,
    detectSingleColorCol,
    detectSingleColorRow,
    fillSingleEmptyCellInCol,
    fillSingleEmptyCellInRow,
    puzzleContent,
    size,
  ]);

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
