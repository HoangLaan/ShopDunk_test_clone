import React, { createContext, useState, useContext } from 'react';

export const PurchaseOrderDivisionContext = createContext({});

export function PurchaseOrderDivisionProvider({ children }) {
  const [purchaseOrderDivisionState, setPurchaseOrderDivisionState] = useState({
    productOptions: [],
  });

  const setProductOptions = (productOptions) => {
    setPurchaseOrderDivisionState((prevState) => ({ ...prevState, productOptions }));
  };

  const value = {
    ...purchaseOrderDivisionState,
    setPurchaseOrderDivisionState,
    setProductOptions,
  };

  return <PurchaseOrderDivisionContext.Provider value={value}>{children}</PurchaseOrderDivisionContext.Provider>;
}

export const usePurchaseOrderDivisionContext = () => useContext(PurchaseOrderDivisionContext);
