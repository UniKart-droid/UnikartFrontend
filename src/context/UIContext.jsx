import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isChatPage, setIsChatPage] = useState(false);

  return (
    <UIContext.Provider value={{ isChatPage, setIsChatPage }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);