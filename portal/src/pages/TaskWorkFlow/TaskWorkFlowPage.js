import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { notification } from 'antd';
import TaskWorkFlowFilter from './components/TaskWorkFlowFilter';
import TaskWorkFlowTable from './components/TaskWorkFlowTable';
import { exportExcelTaskWorkflow, getListTaskWorkflow } from 'services/task-work-flow.service';
import ModalImportExcel from './components/add/Modal/ModalImportExcel';
import Loading from 'components/shared/Loading/index';
import ModalImportError from './components/add/Modal/ModalImportError';

const TaskWorkFlowPage = () => {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingExport, setLoadingExport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false);
  const [errorImport, setErrorImport] = useState({});
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadTaskWorkflow = useCallback(() => {
    setLoading(true);
    getListTaskWorkflow(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const exportExcel = () => {
    setLoadingExport(true);
    exportExcelTaskWorkflow(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `Task_Work_Flow_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => notification.error({ message: error.message || 'Lỗi tải tập tin.' }))
      .finally((done) => setLoadingExport(false));
  };

  useEffect(loadTaskWorkflow, [loadTaskWorkflow]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <TaskWorkFlowFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <TaskWorkFlowTable
          loading={loading}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          importExcel={() => setOpenModalImport(true)}
          exportExcel={() => exportExcel()}
          onRefresh={loadTaskWorkflow}
        />
        {loadingExport && <Loading />}
        {openModalImport && (
          <ModalImportExcel
            open={openModalImport}
            onClose={() => {
              setOpenModalImport(false);
              loadTaskWorkflow();
            }}
            handleSetErrorImport={(data) => {
              setErrorImport(data);
            }}></ModalImportExcel>
        )}
        {errorImport.error && (
          <ModalImportError
            open={errorImport.error}
            onClose={() => setErrorImport({})}
            errors={errorImport}></ModalImportError>
        )}
      </div>
    </React.Fragment>
  );
};

export default TaskWorkFlowPage;
