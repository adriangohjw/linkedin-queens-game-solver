import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function StartingLayout({
  size,
  puzzleColors,
}: {
  size: number;
  puzzleColors: (string | null)[][];
}) {
  return (
    <Layout title="Starting Layout">
      <Puzzle size={size} colors={puzzleColors} />
    </Layout>
  );
}
