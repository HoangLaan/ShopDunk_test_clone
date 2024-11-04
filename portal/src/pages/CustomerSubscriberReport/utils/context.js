import React, { createContext, useState, useContext } from 'react';

export const CustomerSubscriberReportContext = createContext({});

export function CustomerSubscriberReportProvider({ children }) {
  const [customerSubscriberReportState, setCustomerSubscriberReportState] = useState({});

  const value = {
    ...customerSubscriberReportState,
    setCustomerSubscriberReportState,
  };

  return <CustomerSubscriberReportContext.Provider value={value}>{children}</CustomerSubscriberReportContext.Provider>;
}

export const useCustomerSubscriberReportContext = () => useContext(CustomerSubscriberReportContext);
