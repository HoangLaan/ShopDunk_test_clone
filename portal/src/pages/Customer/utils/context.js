import React, { createContext, useState, useContext } from 'react';

export const CustomerContext = createContext({});

export function CustomerProvider({ children }) {
  const [state, setCustomerState] = useState({
    isOpenModalAddressBook: false,
    isOpenModalHobbies: false,
    isOpenModalRelatives: false,
    isOpenModalAffiliate: false,
    isOpenModalImport: false,
    isOpenModalImportError: false,
    isOpenModalAddCompany: false,
    refreshModalHobbies: () => {},
    hobbiesRelativesMethods: () => {},
    refreshTableAddressBook: () => {},
    importErrors: [],
    importTotal: [],
    refresh: () => {},
  });

  const openModalAddressBook = (isOpen) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalAddressBook: isOpen }));
  };
  const openModalHobbies = (isOpen) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalHobbies: isOpen }));
  };
  const openModalRelatives = (isOpen) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalRelatives: isOpen }));
  };
  const openModalAffiliate = (isOpen) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalAffiliate: isOpen }));
  };
  const openModalImport = (isOpen) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalImport: isOpen }));
  };
  const openModalAddCompany = (isOpen) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalAddCompany: isOpen }));
  };
  const openModalImportError = (isOpen, importErrors = [], importTotal = null) => {
    setCustomerState((prev) => ({ ...prev, isOpenModalImportError: isOpen, importErrors, importTotal }));
    if (!isOpen) {
      state.refresh();
    }
  };
  const setRefresh = (refresh) => {
    setCustomerState((prev) => ({ ...prev, refresh }));
  };

  const value = {
    ...state,
    setCustomerState,
    openModalAddressBook,
    openModalHobbies,
    openModalRelatives,
    openModalAffiliate,
    openModalImportError,
    openModalImport,
    setRefresh,
    openModalAddCompany,
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export const useCustomerContext = () => useContext(CustomerContext);
