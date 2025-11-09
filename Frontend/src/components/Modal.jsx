import { useEffect } from "react";
import { Button } from "./index.js";

function Modal({ isOpen, onClose, children, title }) {
  // Disable scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return isOpen ? (
    <div
      className="
        fixed inset-0 flex justify-center items-center
        bg-[rgba(0,0,0,0.5)]
        z-50"
      onClick={onClose}
    >
      <div
        className="
          bg-white
          w-[90%] max-w-[800px]
          rounded-xl
          shadow-2xl
          p-6
          max-h-[80vh]
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title || ""}</h2>
          <Button
            className="
              bg-gray-300 text-gray-700 hover:bg-gray-400
              rounded-full p-2 w-8 h-8 flex justify-center items-center
            "
            onClick={onClose}
          >
            X
          </Button>
        </div>

        <hr className="border-gray-300 mb-4" />

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  ) : null;
}

export default Modal;
