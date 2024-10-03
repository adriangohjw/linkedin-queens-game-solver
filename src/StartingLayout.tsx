import { PuzzleType } from "./types";
import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function StartingLayout({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: PuzzleType;
}) {
  return (
    <Layout title="Starting Layout">
      <Puzzle size={size} colors={puzzleColors} />
    </Layout>
  );
}
