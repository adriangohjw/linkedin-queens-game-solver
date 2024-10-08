import { CellType, ColorType } from "./types";
import Layout from "./Layout";
import Puzzle from "./Puzzle";
import ColorPicker from "./ColorPicker";
import SizeSlider from "./SizeSlider";

export default function StartingLayout({
  size,
  puzzleColors,
  setPuzzleColor,
  selectedColor,
  setSelectedColor,
  clearBoard,
}: {
  size: number;
  puzzleColors: ColorType[][];
  setPuzzleColor: ({ cell }: { cell: CellType }) => void;
  selectedColor: ColorType;
  setSelectedColor: (color: ColorType) => void;
  clearBoard: ({ size }: { size?: number }) => void;
}) {
  return (
    <Layout title="Starting Layout">
      <Puzzle
        size={size}
        colors={puzzleColors}
        setPuzzleColor={setPuzzleColor}
      />
      <ColorPicker
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <SizeSlider size={size} clearBoard={clearBoard} />
    </Layout>
  );
}
