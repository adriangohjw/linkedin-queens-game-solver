import { ColorType } from "./types";
import { COLOR_OPTIONS, getColorCode } from "./constant";

export default function ColorPicker({
  selectedColor,
  setSelectedColor,
}: {
  selectedColor: ColorType;
  setSelectedColor: (color: ColorType) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {COLOR_OPTIONS.map((color) => (
        <div
          key={color}
          onClick={() => setSelectedColor(color)}
          className={`w-10 h-10 rounded-full ${
            color === selectedColor
              ? "border-4 border-black"
              : "border border-gray-500 cursor-pointer"
          }`}
          style={{ backgroundColor: getColorCode(color) }}
        />
      ))}
    </div>
  );
}
