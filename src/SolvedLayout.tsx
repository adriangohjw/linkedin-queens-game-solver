import { useState, useEffect, useCallback } from "react";
import { CellType, CellContentType, ColorType } from "./types";
import { YES, NO, COLOR_OPTIONS } from "./constant";
import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function SolvedLayout({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: ColorType[][];
}) {
  const [puzzleContent, setPuzzleContent] = useState<CellContentType[][]>(() =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => null))
  );

  let colors: Record<string, CellType[]> = Object.fromEntries(
    COLOR_OPTIONS.map((color) => [color, []])
  );

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const color: ColorType = puzzleColors[row][col];
      if (color) {
        colors[color].push({ row, col });
      }
    }
  }

  const totalCellsCount: number = size * size;
  const puzzleColorsFilledCount: number = puzzleColors
    .flat()
    .filter((color) => color !== null).length;
  const isAllPuzzleColorsFilled: boolean =
    puzzleColorsFilledCount === totalCellsCount;

  const getEmptyCells = useCallback(
    ({ color }: { color: ColorType }): CellType[] => {
      if (!isAllPuzzleColorsFilled) return [];

      const cells: CellType[] = colors[color as string];
      return cells.filter((cell) => puzzleContent[cell.row][cell.col] === null);
    },
    [colors, puzzleContent, isAllPuzzleColorsFilled]
  );

  const markGrid = useCallback(
    ({ cell, content }: { cell: CellType; content: CellContentType }): void => {
      setPuzzleContent((prev) => {
        const newGrid: CellContentType[][] = [...prev];
        newGrid[cell.row][cell.col] = content;
        return newGrid;
      });
    },
    []
  );

  const markNo = useCallback(
    ({ cell }: { cell: CellType }): void => {
      if (cell.row < 0 || cell.row >= size) return;
      if (cell.col < 0 || cell.col >= size) return;
      if (puzzleContent[cell.row][cell.col] === NO) return;
      if (puzzleContent[cell.row][cell.col] === YES) return;

      markGrid({ cell, content: NO });
    },
    [size, puzzleContent, markGrid]
  );

  const markSurroundingNo = useCallback(
    ({ cell }: { cell: CellType }): void => {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const newRow: number = cell.row + i;
          const newCol: number = cell.col + j;
          if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
            markNo({ cell: { row: newRow, col: newCol } as CellType });
          }
        }
      }
    },
    [markNo, size]
  );

  const markRowNo = useCallback(
    ({ row, excludeCol }: { row: number; excludeCol: number }): void => {
      for (let i = 0; i < size; i++) {
        if (i === excludeCol) continue;

        markNo({ cell: { row, col: i } as CellType });
      }
    },
    [markNo, size]
  );

  const markColNo = useCallback(
    ({ col, excludeRow }: { col: number; excludeRow: number }): void => {
      for (let i = 0; i < size; i++) {
        if (i === excludeRow) continue;

        markNo({ cell: { row: i, col } as CellType });
      }
    },
    [markNo, size]
  );

  const markAllOtherSameColorCellsNo = useCallback(
    ({
      color,
      excludedCell,
    }: {
      color: string;
      excludedCell: CellType;
    }): void => {
      const remainingEmptyCells: CellType[] = getEmptyCells({ color }).filter(
        (cell) => cell.row !== excludedCell.row || cell.col !== excludedCell.col
      );
      remainingEmptyCells.forEach((cell) => markNo({ cell }));
    },
    [getEmptyCells, markNo]
  );

  const markYes = useCallback(
    ({ cell }: { cell: CellType }): void => {
      if (puzzleContent[cell.row][cell.col] === YES) return;

      markGrid({ cell, content: YES });
      markAllOtherSameColorCellsNo({
        color: puzzleColors[cell.row][cell.col] as string,
        excludedCell: cell,
      });
      markSurroundingNo({ cell });
      markRowNo({ row: cell.row, excludeCol: cell.col });
      markColNo({ col: cell.col, excludeRow: cell.row });
    },
    [
      puzzleContent,
      markGrid,
      markAllOtherSameColorCellsNo,
      puzzleColors,
      markSurroundingNo,
      markRowNo,
      markColNo,
    ]
  );

  const fillSingleEmptyCellInRow = useCallback(
    ({ row }: { row: number }): void => {
      const currentRowContent: CellContentType[] = puzzleContent[row];

      const emptyCellIndices: number[] = currentRowContent
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCellIndices.length === 1) {
        markYes({ cell: { row, col: emptyCellIndices[0] } as CellType });
      }
    },
    [puzzleContent, markYes]
  );

  const fillSingleEmptyCellInCol = useCallback(
    ({ col }: { col: number }): void => {
      const currentColContent: CellContentType[] = puzzleContent.map(
        (row) => row[col]
      );

      const emptyCellIndices: number[] = currentColContent
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCellIndices.length === 1) {
        markYes({ cell: { row: emptyCellIndices[0], col } as CellType });
      }
    },
    [puzzleContent, markYes]
  );

  const detectSingleColorRow = useCallback(
    ({ row }: { row: number }): void => {
      const emptyCellIndices: number[] = puzzleContent[row]
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCellIndices.length === 0) return;

      const uniqueColors: Set<ColorType> = new Set(
        emptyCellIndices
          .map((index) => puzzleColors[row][index])
          .filter((cell) => cell !== null)
      );
      if (uniqueColors.size === 1) {
        const color: ColorType = uniqueColors.values().next().value;
        if (color) {
          // markNoForColorExceptRow
          for (let i = 0; i < size; i++) {
            if (i !== row) {
              for (let j = 0; j < size; j++) {
                if (puzzleColors[i][j] === color) {
                  markNo({ cell: { row: i, col: j } as CellType });
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
    ({ col }: { col: number }): void => {
      const emptyCellIndices: number[] = puzzleColors[col]
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1);

      if (emptyCellIndices.length === 0) return;

      const uniqueColors: Set<ColorType> = new Set(
        emptyCellIndices
          .map((index) => puzzleColors[index][col])
          .filter((cell) => cell !== null)
      );
      if (uniqueColors.size === 1) {
        const color: ColorType = uniqueColors.values().next().value;
        if (color) {
          // markNoForColorExceptCol
          for (let i = 0; i < size; i++) {
            if (i !== col) {
              for (let j = 0; j < size; j++) {
                if (puzzleColors[j][i] === color) {
                  markNo({ cell: { row: j, col: i } as CellType });
                }
              }
            }
          }
        }
      }
    },
    [puzzleColors, size, markNo]
  );

  const detectIfColorInSingleRowOrCol = useCallback(
    ({ color }: { color: ColorType }): void => {
      const cells: CellType[] = getEmptyCells({ color });

      const rowIndices = new Set(cells.map((cell) => cell.row));
      if (rowIndices.size === 1) {
        const row = rowIndices.values().next().value;
        if (typeof row === "number") {
          for (let i = 0; i < size; i++) {
            if (puzzleColors[row][i] !== color) {
              markNo({ cell: { row, col: i } as CellType });
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
              markNo({ cell: { row: i, col } as CellType });
            }
          }
        }
      }
    },
    [getEmptyCells, size, puzzleColors, markNo]
  );

  const detectTwoAdjacentEmptyCellsInRow = useCallback(
    ({ row, cells }: { row: number; cells: CellType[] }): void => {
      const colIndices: number[] = cells.map((cell) => cell.col);
      const uniqueColIndices: number[] = Array.from(new Set(colIndices));
      if (uniqueColIndices.length !== 2) return;

      const [firstCol, secondCol] = uniqueColIndices as [number, number];
      if (Math.abs(firstCol - secondCol) !== 1) return;

      markNo({ cell: { row: row - 1, col: firstCol } as CellType });
      markNo({ cell: { row: row + 1, col: firstCol } as CellType });
      markNo({ cell: { row: row - 1, col: secondCol } as CellType });
      markNo({ cell: { row: row + 1, col: secondCol } as CellType });
    },
    [markNo]
  );

  const detectTwoAdjacentEmptyCellsInCol = useCallback(
    ({ col, cells }: { col: number; cells: CellType[] }): void => {
      const rowIndices: number[] = cells.map((cell) => cell.row);
      const uniqueRowIndices: number[] = Array.from(new Set(rowIndices));
      if (uniqueRowIndices.length !== 2) return;

      const [firstRow, secondRow]: [number, number] = uniqueRowIndices as [
        number,
        number
      ];
      if (Math.abs(firstRow - secondRow) !== 1) return;

      markNo({ cell: { row: firstRow, col: col - 1 } as CellType });
      markNo({ cell: { row: firstRow, col: col + 1 } as CellType });
      markNo({ cell: { row: secondRow, col: col - 1 } as CellType });
      markNo({ cell: { row: secondRow, col: col + 1 } as CellType });
    },
    [markNo]
  );

  const detectTwoAdjacentEmptyCells = useCallback(
    ({ color }: { color: ColorType }): void => {
      const emptyCells: CellType[] = getEmptyCells({ color });
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

  const detectThreeAdjacentEmptyCellsInRow = useCallback(
    ({ row, cells }: { row: number; cells: CellType[] }): void => {
      const colIndices: number[] = cells.map((cell) => cell.col);
      let uniqueColIndices: number[] = Array.from(new Set(colIndices));
      if (uniqueColIndices.length !== 3) return;

      uniqueColIndices.sort((a, b) => a - b);
      const [firstCol, secondCol, thirdCol]: [number, number, number] =
        uniqueColIndices as [number, number, number];
      if (firstCol - secondCol !== 1 || secondCol - thirdCol !== 1) return;

      markNo({ cell: { row: row - 1, col: secondCol } as CellType });
      markNo({ cell: { row: row + 1, col: secondCol } as CellType });
    },
    [markNo]
  );

  const detectThreeAdjacentEmptyCellsInCol = useCallback(
    ({ col, cells }: { col: number; cells: CellType[] }): void => {
      const rowIndices: number[] = cells.map((cell) => cell.row);
      let uniqueRowIndices: number[] = Array.from(new Set(rowIndices));
      if (uniqueRowIndices.length !== 3) return;

      uniqueRowIndices.sort((a, b) => a - b);
      const [firstRow, secondRow, thirdRow]: [number, number, number] =
        uniqueRowIndices as [number, number, number];
      if (secondRow - firstRow !== 1 || thirdRow - secondRow !== 1) return;

      markNo({ cell: { row: secondRow, col: col - 1 } as CellType });
      markNo({ cell: { row: secondRow, col: col + 1 } as CellType });
    },
    [markNo]
  );

  const detectThreeAdjacentEmptyCells = useCallback(
    ({ color }: { color: string }): void => {
      const emptyCells: CellType[] = getEmptyCells({ color });
      if (emptyCells.length !== 3) return;

      detectThreeAdjacentEmptyCellsInCol({
        col: emptyCells[0].col,
        cells: emptyCells,
      });
      detectThreeAdjacentEmptyCellsInRow({
        row: emptyCells[0].row,
        cells: emptyCells,
      });
    },
    [
      getEmptyCells,
      detectThreeAdjacentEmptyCellsInCol,
      detectThreeAdjacentEmptyCellsInRow,
    ]
  );

  const isSolved = (): boolean => {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (puzzleContent[i][j] === null) return false;
      }
    }

    // check every row only one YES
    for (let i = 0; i < size; i++) {
      const yesCount: number = puzzleContent[i].filter(
        (cell) => cell === YES
      ).length;
      if (yesCount !== 1) return false;
    }

    // check every col has only one YES
    for (let j = 0; j < size; j++) {
      const yesCount: number = puzzleContent
        .map((row) => row[j])
        .filter((cell) => cell === YES).length;
      if (yesCount !== 1) return false;
    }

    const yesCells: CellType[] = puzzleContent
      .flatMap((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell === YES ? { row: rowIndex, col: colIndex } : undefined
        )
      )
      .filter((cell): cell is CellType => cell !== undefined);
    if (yesCells.length !== size) return false;

    for (let n = 0; n < yesCells.length - 1; n++) {
      const currentCell: CellType = yesCells[n];
      if (currentCell === null) return false;

      const nextCell: CellType | null = yesCells[n + 1];
      if (nextCell === null) return false;

      if (Math.abs(currentCell.col - nextCell.col) <= 1) {
        return false;
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
      detectIfColorInSingleRowOrCol({ color });
      detectTwoAdjacentEmptyCells({ color });
      detectThreeAdjacentEmptyCells({ color });
    });
  }, [
    colors,
    detectIfColorInSingleRowOrCol,
    detectSingleColorCol,
    detectSingleColorRow,
    detectThreeAdjacentEmptyCells,
    detectTwoAdjacentEmptyCells,
    fillSingleEmptyCellInCol,
    fillSingleEmptyCellInRow,
    puzzleContent,
    size,
  ]);

  const uniquePuzzleColorsCount: number = Object.keys(colors).filter(
    (color) => colors[color].length > 0
  ).length;
  const correctPuzzleColorsCount: boolean = size === uniquePuzzleColorsCount;

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
