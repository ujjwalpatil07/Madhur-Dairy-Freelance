import { createContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navbarInput, setNavbarInput] = useState("");

  const highlightMatch = (text, term) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    const parts = String(text || "")?.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span
          key={i * 0.9}
          className="bg-yellow-300 dark:bg-yellow-600 font-semibold"
        >
          {part}
        </span>
      ) : (
        <span key={i * 0.9}>{part}</span>
      )
    );
  };
  

  const contextValue = useMemo(() => ({
    isSidebarOpen,
    navbarInput,
    setIsSidebarOpen,
    setNavbarInput,
    highlightMatch
  }), [isSidebarOpen, navbarInput]);



  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.node
};