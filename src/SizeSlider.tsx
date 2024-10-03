export default function SizeSlider({
  size,
  clearBoard,
}: {
  size: number;
  clearBoard: ({ size }: { size?: number }) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="size-slider" className="whitespace-nowrap">
        Select Size: {size}
      </label>
      <input
        id="size-slider"
        type="range"
        min="6"
        max="10"
        value={size}
        onChange={(event) => {
          clearBoard({ size: Number(event.target.value) });
        }}
        className="w-full"
      />
    </div>
  );
}
