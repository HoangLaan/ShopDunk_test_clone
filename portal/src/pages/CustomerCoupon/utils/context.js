import React, { createContext, useState, useContext } from 'react';

export const CustomerCouponContext = createContext({});

export function CustomerCouponProvider({ children }) {
  const [customerCouponState, setCustomerCouponState] = useState({});

  const value = {
    ...customerCouponState,
    setCustomerCouponState,
  };

  return <CustomerCouponContext.Provider value={value}>{children}</CustomerCouponContext.Provider>;
}

export const useCustomerCouponContext = () => useContext(CustomerCouponContext);
