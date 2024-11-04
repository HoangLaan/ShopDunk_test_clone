import React, { createContext, useState, useContext } from 'react';

export const InternalTransferTypeContext = createContext({});

export function InternalTransferTypeProvider({ children }) {
  const [internalTransferTypeState, setInternalTransferTypeState] = useState({});

  const value = {
    ...internalTransferTypeState,
    setInternalTransferTypeState,
  };

  return <InternalTransferTypeContext.Provider value={value}>{children}</InternalTransferTypeContext.Provider>;
}

export const useInternalTransferTypeContext = () => useContext(InternalTransferTypeContext);
