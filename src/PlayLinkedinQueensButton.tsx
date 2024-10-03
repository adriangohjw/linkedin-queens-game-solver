export default function PlayLinkedinQueensButton() {
  return (
    <button
      className="mt-4 py-1 px-4 bg-white text-black border border-black rounded-lg hover:opacity-75 hover:shadow-md"
      onClick={() =>
        window.open("https://www.linkedin.com/games/queens", "_blank")
      }
    >
      Play LinkedIn Queens
    </button>
  );
}
