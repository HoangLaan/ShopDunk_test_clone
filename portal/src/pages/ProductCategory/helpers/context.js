import React, { createContext, useState, useContext } from 'react';

export const PCAContext = createContext({
  isOpenModalAttribute: false,
  isOpenModalAttributeAdd: false,
  setOpenModalAttribute: () => {},
  setOpenModalAttributeAdd: () => {},
});

export function PCAProvider({ children }) {
  const [isOpenModalAttribute, setIsOpenModalAttribute] = useState(false);
  const [isOpenModalAttributeAdd, setIsOpenModalAttributeAdd] = useState(false);

  const setOpenModalAttribute = (isOpen) => setIsOpenModalAttribute(isOpen);
  const setOpenModalAttributeAdd = (isOpen) => {
    setIsOpenModalAttributeAdd(isOpen);
    setOpenModalAttribute(!isOpen);
  };

  const value = {
    isOpenModalAttribute,
    isOpenModalAttributeAdd,
    setOpenModalAttribute,
    setOpenModalAttributeAdd,
  };

  return <PCAContext.Provider value={value}>{children}</PCAContext.Provider>;
}

export const usePCA = () => useContext(PCAContext);
