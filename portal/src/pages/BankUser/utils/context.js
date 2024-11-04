import React, { createContext, useState, useContext } from 'react';

export const BankUserContext = createContext({});

export function BankUserProvider({ children }) {
  const [importState, setImportState] = useState({
    isOpenModalImport: false,
    isOpenModalImportError: false,
    importErrors: [],
    importTotal: null,
    refreshAfterImport: () => {},
  });

  const openModalImport = (isOpen) => {
    setImportState((prev) => ({ ...prev, isOpenModalImport: isOpen }));
  };
  const openModalImportError = (isOpen, importErrors = [], importTotal = null) => {
    setImportState((prev) => ({ ...prev, isOpenModalImportError: isOpen, importErrors, importTotal }));
    if (!isOpen) {
      importState.refreshAfterImport()
    }
  };

  const value = {
    ...importState,
    setImportState,
    openModalImportError,
    openModalImport,
  };

  return <BankUserContext.Provider value={value}>{children}</BankUserContext.Provider>;
}

export const useBankUserContext = () => useContext(BankUserContext);
