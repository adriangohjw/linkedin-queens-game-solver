import { Dispatch, SetStateAction } from "react";
import { INITIAL_PUZZLE_OPTIONS } from "./InitialPuzzleOptions";

export default function LayoutTemplateButtons({
  layoutSelected,
  setLayoutSelected,
  clearBoard,
}: {
  layoutSelected: number | null;
  setLayoutSelected: Dispatch<SetStateAction<number | null>>;
  clearBoard: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-center">
      <p>Select Preset Layout:</p>
      <div className="flex gap-2">
        {INITIAL_PUZZLE_OPTIONS.map((_, index) => (
          <TemplateButton
            key={index}
            selected={layoutSelected === index}
            onClick={() => setLayoutSelected(index)}
            text={`${index + 1}`}
          />
        ))}
        <TemplateButton
          key="clear"
          selected={false}
          onClick={() => clearBoard()}
          text={"Clear"}
        />
      </div>
    </div>
  );
}

function TemplateButton({
  selected,
  onClick,
  text,
}: {
  selected: boolean;
  onClick: () => void;
  text: string;
}): JSX.Element {
  return (
    <button
      className={`py-1 px-3 rounded-lg ${
        selected
          ? "bg-black text-white cursor-default"
          : "bg-white text-black cursor-pointer border border-gray-500 hover:opacity-75 hover:shadow-md"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
