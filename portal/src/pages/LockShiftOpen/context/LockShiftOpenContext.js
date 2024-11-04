import React, { createContext, useState } from 'react'

const LockShiftOpenContext = createContext();
// Provide Context
export const LockShiftOpenProvider = ({ children }) => {
  const [statistic, setStatistic] = useState();
  return (
    <LockShiftOpenContext.Provider value={{ statistic,setStatistic }}>
      {children}
    </LockShiftOpenContext.Provider>
  )
}

export default LockShiftOpenContext;