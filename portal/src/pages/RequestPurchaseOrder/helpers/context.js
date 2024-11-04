import React, { createContext, useState, useContext } from 'react';

export const RequestPurchaseContext = createContext({});

export function RequestPurchaseProvider({ children }) {
  const [openModalSupplierAdd, setOpenModalSupplierAdd] = useState(false);

  const [openModalPRList, setOpenModalPRList] = useState(false);
  const [modalPRListProduct, setModalPRListProduct] = useState({});
  const [modalPRList, setModalPRList] = useState([]);

  const openModalPRListFunc = (product, prList) => {
    setModalPRListProduct(product);
    setOpenModalPRList(true);
    setModalPRList(prList)
  };

  const closeModalPRListFunc = () => {
    setOpenModalPRList(false);
    setModalPRListProduct({})
    setModalPRList([])
  };

  const value = {
    openModalSupplierAdd,
    setOpenModalSupplierAdd,

    openModalPRList,
    setOpenModalPRList,
    openModalPRListFunc,
    closeModalPRListFunc,
    modalPRListProduct,
    setModalPRListProduct,
    modalPRList,
    setModalPRList
  };

  return <RequestPurchaseContext.Provider value={value}>{children}</RequestPurchaseContext.Provider>;
}

export const useRequestPurchaseContext = () => useContext(RequestPurchaseContext);
