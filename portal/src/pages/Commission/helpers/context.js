import React, { createContext, useState, useContext } from 'react';

export const CommissionContext = createContext({});

export function CommissionProvider({ children }) {
  const [isOpenModalDepartment, setIsOpenModalDepartment] = useState(false);
  const [isOpenModalStore, setIsOpenModalStore] = useState(false);
  const [isOpenModalReview, setIsOpenModalReview] = useState(false);

  const value = {
    isOpenModalDepartment,
    setIsOpenModalDepartment,
    isOpenModalStore,
    setIsOpenModalStore,
    isOpenModalReview,
    setIsOpenModalReview,
  };

  return <CommissionContext.Provider value={value}>{children}</CommissionContext.Provider>;
}

export const useCommissionContext = () => useContext(CommissionContext);
