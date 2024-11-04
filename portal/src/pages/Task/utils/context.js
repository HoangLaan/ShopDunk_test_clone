import React, { createContext, useState, useContext } from 'react';
import { StyledTask } from './style';

export const TaskContext = createContext({});

export function TaskProvider({ children }) {
  const [taskState, setTaskState] = useState({});
  const { refreshCustomerCare } = taskState;

  return (
    <TaskContext.Provider
      value={{
        refreshCustomerCare,
        setTaskState,
      }}>
      <StyledTask>{children}</StyledTask>
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);
