import React, { createContext, useState, useContext } from 'react';

export const TaskTypeContext = createContext({});

export function TaskTypeProvider({ children }) {
  const [openModalTaskWorkflow, setOpenModalTaskWorkflow] = useState(false);
  const [importState, setImportState] = useState({
    isOpenModalImport: false,
    isOpenModalImportError: false,
    importErrors: [],
    importTotal: null,
    refreshTaskType: () => {},
  });

  const [dataRowsCondition, setDataRowsCondition] = useState([]);
  const [modalConditionState, setModalConditionState] = useState({
    isOpenModalCondition: false,
    taskWorkflowIndex: null,
    defaultCondition: [],
    conditionSelected: [],
    refreshCondition: () => {},
  });

  const openModalImport = (isOpen) => {
    setImportState((prev) => ({ ...prev, isOpenModalImport: isOpen }));
  };
  const openModalImportError = (isOpen, importErrors = [], importTotal = null) => {
    setImportState((prev) => ({ ...prev, isOpenModalImportError: isOpen, importErrors, importTotal }));
    if (!isOpen) {
      importState.refreshTaskType();
    }
  };
  const openModalCondition = (isOpen, taskWorkflowIndex = null, defaultCondition) => {
    const _state = { isOpenModalCondition: isOpen, taskWorkflowIndex, defaultCondition };
    if (!isOpen) {
      _state.conditionSelected = [];
    }
    setModalConditionState((prev) => ({ ...prev, ..._state }));
  };

  const value = {
    openModalTaskWorkflow,
    setOpenModalTaskWorkflow,
    ...importState,
    setImportState,
    openModalImportError,
    openModalImport,
    ...modalConditionState,
    setModalConditionState,
    openModalCondition,
    dataRowsCondition,
    setDataRowsCondition,
  };

  return <TaskTypeContext.Provider value={value}>{children}</TaskTypeContext.Provider>;
}

export const useTaskTypeContext = () => useContext(TaskTypeContext);
