import { createContext, useContext, useState } from "react";

// Create Context
const HeaderContext = createContext();

// Context Provider Component
export const HeaderProvider = ({ children }) => {
  const [headerText, setHeaderText] = useState("Welcome");

  return (
    <HeaderContext.Provider value={{ headerText, setHeaderText }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Custom Hook for easier use
export const useHeader = () => useContext(HeaderContext);
