import { useState, useEffect, useRef } from "react";

export default function RulesButton() {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowModal(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      <button
        className="mt-4 py-1 px-4 bg-black text-white rounded-lg hover:opacity-75 hover:shadow-md"
        onClick={() => setShowModal(true)}
      >
        Show Game Rules
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="p-6 md:p-8 bg-white rounded-lg shadow-lg flex flex-col gap-4 mx-4 sm:mx-0"
          >
            <h2 className="text-xl font-bold">Game Rules</h2>
            <div>
              <p>
                Each row, column, and colored region must contain exactly one
                Star symbol (Queen).
              </p>
              <p>
                Star symbols cannot be placed in adjacent cells, including
                diagonally.
              </p>
            </div>
            <button
              className="mt-2 py-1 px-4 bg-black text-white rounded-lg w-fit hover:opacity-75 hover:shadow-md mx-auto"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
