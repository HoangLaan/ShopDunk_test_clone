import React, { createContext, useState, useContext } from 'react';

export const ProductAddContext = createContext({
  isOpenModalAttribute: false,
  isOpenModalAttributeAdd: false,
  setOpenModalAttribute: () => {},
  setOpenModalAttributeAdd: () => {},
});

export function ProductAddProvider({ children }) {
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

  return <ProductAddContext.Provider value={value}>{children}</ProductAddContext.Provider>;
}

export const useProductAdd = () => useContext(ProductAddContext);
