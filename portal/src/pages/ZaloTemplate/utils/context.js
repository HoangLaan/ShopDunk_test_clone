import React, { createContext, useState, useContext } from 'react';

export const ZaloTemplateContext = createContext({});

export function ZaloTemplateProvider({ children }) {
  const [zaloTemplateState, setZaloTemplateState] = useState({});

  const value = {
    ...zaloTemplateState,
    setZaloTemplateState,
  };

  return <ZaloTemplateContext.Provider value={value}>{children}</ZaloTemplateContext.Provider>;
}

export const useZaloTemplateContext = () => useContext(ZaloTemplateContext);
