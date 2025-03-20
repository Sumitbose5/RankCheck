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
    <div className={`relative ${width}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center cursor-pointer bg-transparent text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none border border-gray-600"
      >
        {selected || "Select an option"}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <ul className="absolute w-full mt-2 bg-gray-900 text-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

