import React, { createContext, useState, useContext } from 'react';

export const PurchaseRequisitionTypeContext = createContext({});

export function PurchaseRequisitionTypeProvider({ children }) {
  const [purchaseRequisitionTypeState, setPurchaseRequisitionTypeState] = useState({});

  const value = {
    ...purchaseRequisitionTypeState,
    setPurchaseRequisitionTypeState,
  };

  return <PurchaseRequisitionTypeContext.Provider value={value}>{children}</PurchaseRequisitionTypeContext.Provider>;
}

export const usePurchaseRequisitionTypeContext = () => useContext(PurchaseRequisitionTypeContext);
