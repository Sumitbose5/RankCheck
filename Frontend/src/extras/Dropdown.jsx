import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assuming these are your icons

export const Dropdown = ({ options = [], selected, onSelect, width = "w-48" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle selection update
  const handleSelect = (option) => {
    if (option !== selected) {
      onSelect(option); // Update external state
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${width} font-mono`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center cursor-pointer bg-zinc-900 text-white px-4 py-2 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-zinc-800 focus:outline-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <span className="font-black uppercase tracking-tighter truncate">
          {selected || "SELECT_VAL"}
        </span>
        {isOpen ? <ChevronUp size={20} strokeWidth={3} className="text-lime-400" /> : <ChevronDown size={20} strokeWidth={3} className="text-lime-400" />}
      </button>

      {isOpen && (
        <ul className="absolute w-full mt-3 bg-white text-black border-4 border-black shadow-[8px_8px_0px_0px_#8b5cf6] z-[100] animate-in fade-in zoom-in duration-100">
          <div className="max-h-48 overflow-y-auto custom-scrollbar">
            {options.map((option, index) => (
              <li
                key={index}
                className="px-4 py-3 border-b-2 border-zinc-100 last:border-none font-bold uppercase text-sm hover:bg-lime-400 hover:text-black cursor-pointer transition-colors"
                onClick={() => handleSelect(option)}
              >
                {`> ${option}`}
              </li>
            ))}
          </div>
        </ul>
      )}

      {/* Tailwind CSS for the scrollbar if you want it to match */}
      <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f4f4f5;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #000;
      border: 2px solid #f4f4f5;
    }
  `}</style>
    </div>
  );
};

