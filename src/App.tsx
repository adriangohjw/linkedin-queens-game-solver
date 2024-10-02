import StartingLayout from "./StartingLayout";
import SolvedLayout from "./SolvedLayout";

export default function App() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-blue-600">
        LinkedIn Queens Game Solver
      </h1>
      <div className="flex flex-row justify-center items-center">
        <StartingLayout />
        <SolvedLayout />
      </div>
    </div>
  );
}
