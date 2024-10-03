import { ColorType } from "./types";
import Layout from "./Layout";
import Puzzle from "./Puzzle";
import ColorPicker from "./ColorPicker";

export default function StartingLayout({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: ColorType[][];
}) {
  return (
    <Layout title="Starting Layout">
      <Puzzle size={size} colors={puzzleColors} />
      <ColorPicker />
    </Layout>
  );
}
