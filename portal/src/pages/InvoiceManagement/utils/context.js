import React, { createContext, useState, useContext } from 'react';

export const CustomerLeadContext = createContext({});

export function CustomerLeadProvider({ children }) {
  const [state, setCustomerLeadState] = useState({
    openModalAddCompany: false,
    openModalResetPassword: false,
    openModalAffiliate: false,
    openModalImport: false,
    openModalImportError: false,
    importErrors: [],
    importTotal: null,
    refresh: () => {}
  });

  const onOpenModalAddCompany = (isOpen) => {
    setCustomerLeadState((prevState) => ({ ...prevState, openModalAddCompany: isOpen }));
  };
  const onOpenModalResetPassword = (isOpen) => {
    setCustomerLeadState((prevState) => ({ ...prevState, openModalResetPassword: isOpen }));
  };
  const onOpenModalAffiliate = (isOpen) => {
    setCustomerLeadState((prevState) => ({ ...prevState, openModalAffiliate: isOpen }));
  };
  const onOpenModalImport = (isOpen) => {
    setCustomerLeadState((prevState) => ({ ...prevState, openModalImport: isOpen }));
  };
  const onOpenModalImportError = (isOpen, importErrors = [], importTotal = null) => {
    setCustomerLeadState((prevState) => ({ ...prevState, openModalImportError: isOpen, importErrors, importTotal }));
    if (!isOpen) {
      state.refresh()
    }
  };
  const setRefresh = (refresh) => {
    setCustomerLeadState((prevState) => ({ ...prevState, refresh }));
  }

  const value = {
    ...state,
    onOpenModalAddCompany,
    onOpenModalResetPassword,
    onOpenModalAffiliate,
    onOpenModalImport,
    onOpenModalImportError,
    setRefresh,
  };

  return <CustomerLeadContext.Provider value={value}>{children}</CustomerLeadContext.Provider>;
}

export const useCustomerLeadContext = () => useContext(CustomerLeadContext);
