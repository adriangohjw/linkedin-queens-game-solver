import { Dispatch, SetStateAction } from "react";

export default function LayoutTemplateButtons({
  options,
  setPuzzleColors,
}: {
  options: string[][][];
  setPuzzleColors: Dispatch<SetStateAction<(string | null)[][]>>;
}) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <p>Select Preset Layout:</p>
      {options.map((option, index) => (
        <button
          key={index}
          className="py-1 px-4 bg-black text-white rounded-lg hover:bg-gray-800 hover:shadow-md"
          onClick={() => setPuzzleColors(option)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
