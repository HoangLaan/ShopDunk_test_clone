import React, { createContext, useState, useContext } from 'react';

export const InterestContentContext = createContext({});

export function InterestContentProvider({ children }) {
  const [interestContentState, setInterestContentState] = useState({});

  const value = {
    ...interestContentState,
    setInterestContentState,
  };

  return <InterestContentContext.Provider value={value}>{children}</InterestContentContext.Provider>;
}

export const useInterestContentContext = () => useContext(InterestContentContext);
