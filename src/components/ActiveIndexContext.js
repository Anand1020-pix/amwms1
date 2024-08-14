import React, { createContext, useState } from 'react';

export const ActiveIndexContext = createContext();

export const ActiveIndexProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ActiveIndexContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </ActiveIndexContext.Provider>
  );
};