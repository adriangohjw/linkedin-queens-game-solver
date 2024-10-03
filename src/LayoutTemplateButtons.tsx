import { Dispatch, SetStateAction } from "react";
import INITIAL_PUZZLE_OPTIONS from "./InitialPuzzleOptions";

export default function LayoutTemplateButtons({
  layoutSelected,
  setLayoutSelected,
}: {
  layoutSelected: number | null;
  setLayoutSelected: Dispatch<SetStateAction<number | null>>;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-center">
      <p>Select Preset Layout:</p>
      <div className="flex gap-2">
        {INITIAL_PUZZLE_OPTIONS.map((_, index) => (
          <button
            key={index}
            className={`py-1 px-4 rounded-lg ${
              layoutSelected === index
                ? "bg-black text-white cursor-default"
                : "bg-white text-black cursor-pointer border border-gray-500 hover:opacity-75 hover:shadow-md"
            }`}
            onClick={() => setLayoutSelected(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
