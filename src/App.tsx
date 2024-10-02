import StartingLayout from "./StartingLayout";
import SolvedLayout from "./SolvedLayout";
import Footer from "./Footer";

export default function App() {
  const size = 8;

  return (
    <div className="text-center m-4 p-4">
      <h1 className="text-3xl font-bold">LinkedIn Queens Game Solver</h1>
      <div className="flex flex-row justify-center items-center mt-4">
        <StartingLayout size={size} />
        <SolvedLayout size={size} />
      </div>
      <Footer />
    </div>
  );
}
