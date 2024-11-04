import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';

import { deleteBudgets, getListBudget, exportExcel } from 'services/budget.service';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';

import BudgetTable from '../components/BudgetTable';
import BudgFilter from '../components/BudgetFilter';

import ImportExcel from '../components/ImportExcel';
import Loading from '../components/Loading';
import ImportResultModal from '../components/ImportResult';

const DefaultBudgetPage = () => {
  const [params, setParams] = useState(defaultParams);
  const [dataItem, setDataItem] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const [loadingExport, setLoadingExport] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(null);
  const [openModalResultImport, setOpenModalResultImport] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const { items = [], itemsPerPage, page, totalItems, totalPages } = dataItem;

  const loadBudgets = useCallback(() => {
    setLoading(true);
    getListBudget({ ...params, parent_id: 0 })
      .then(setDataItem)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleDelete = (listId) => {
    deleteBudgets(listId)
      .then(() => {
        loadBudgets();
        showToast.success('Xóa ngân sách thành công !');
      })
      .catch((error) => {
        showToast.error(error.message ?? 'Có lỗi xảy ra!');
      });
  };

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  const handleExportExcel = () => {
    setLoadingExport(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `DS_NGAN_SACH_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => setLoadingExport(false));
  };

  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
    if (isReload) setParams(defaultParams);
  };

  const handleSetImportResult = (importResult) => {
    setImportResult(importResult);
    setOpenModalImport(false);
    setOpenModalResultImport(true);
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <BudgFilter onChange={onChange} />
        <BudgetTable
          getChildren={getListBudget}
          onChangePage={(page) => {
            onChange({ page });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          exportExcel={handleExportExcel}
          importExcel={() => setOpenModalImport(true)}
        />
      </div>
      {openModalImport && <ImportExcel onClose={handleCloseModalImport} handleImportDone={handleSetImportResult} />}
      {loadingExport && <Loading />}
      {openModalResultImport && (
        <ImportResultModal results={importResult} onClose={() => setOpenModalResultImport(false)} />
      )}
    </React.Fragment>
  );
};

export default DefaultBudgetPage;
