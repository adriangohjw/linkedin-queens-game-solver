import Layout from "./Layout";
import Puzzle from "./Puzzle";

export default function StartingLayout({ size }: { size: number }) {
  return (
    <Layout title="Starting Layout">
      <Puzzle size={size} />
    </Layout>
  );
}
