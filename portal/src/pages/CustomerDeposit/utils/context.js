import React, { createContext, useState, useContext } from 'react';

export const CustomerDepositContext = createContext({});

export function CustomerDepositProvider({ children }) {
  const [customerDepositState, setCustomerDepositState] = useState({});

  const value = {
    ...customerDepositState,
    setCustomerDepositState,
  };

  return <CustomerDepositContext.Provider value={value}>{children}</CustomerDepositContext.Provider>;
}

export const useCustomerDepositContext = () => useContext(CustomerDepositContext);
