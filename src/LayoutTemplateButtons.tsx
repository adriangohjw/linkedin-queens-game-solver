import { Dispatch, SetStateAction } from "react";

export default function LayoutTemplateButtons({
  options,
  setPuzzleColors,
}: {
  options: string[][][];
  setPuzzleColors: Dispatch<SetStateAction<(string | null)[][]>>;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-center">
      <p>Select Preset Layout:</p>
      <div className="flex gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            className="py-1 px-4 bg-black text-white rounded-lg hover:opacity-75 hover:shadow-md"
            onClick={() => setPuzzleColors(option)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
