// context/ThemeContext.jsx
import React, { createContext, useState, useContext } from "react";
import themes from "../themes/themes";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [team, setTeam] = useState("Ravens");
  
  const value = {
    team,
    setTeam,
    theme: themes[team] || themes.Ravens
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };