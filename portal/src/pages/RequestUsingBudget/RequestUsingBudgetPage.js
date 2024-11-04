import React, { useState, useCallback, useEffect } from 'react';

import RequestUsingBudgetFilter from './components/RequestUsingBudgetFilter';
import RequestUsingBudgetTable from './components/RequestUsingBudgetTable';
import { isEmpty } from 'lodash';
import {
  exportExcelRequestUsingBudget,
  exportPDFRequestUsingBudget,
  getListRequestUsingBudget,
} from 'services/request-using-budget.service.js';
import ImportExcel from 'pages/RequestUsingBudget/components/add/Modal/ImportExcel';
import ImportError from 'pages/RequestUsingBudget/components/add/Modal/ImportError';

import Loading from 'components/shared/Loading/index';

const RequestUsingBudgetPage = () => {
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
  const [total, setTotal] = useState({
    total_browsed: 0,
    total_not_browse: 0,
    total_item: 0,
  });
  const [openModalImport, setOpenModalImport] = useState(null);
  const [openModalErrorImport, setOpenModalErrorImport] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [errorImport, setErrorImport] = useState(null);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadRequestUsingBudget = useCallback(() => {
    setLoading(true);
    getListRequestUsingBudget(params)
      .then((res) => {
        setDataList(res.data);
        setTotal({
          total_browsed: res.total_browsed,
          total_not_browse: res.total_not_browse,
          total_item: res.total_item,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadRequestUsingBudget, [loadRequestUsingBudget]);

  const onFilter = (e) => {
    setParams((prev) => {
      if (isEmpty(e)) {
        return {
          is_active: 1,
          page: 1,
          itemsPerPage: 25,
        };
      }
      return {
        ...prev,
        ...e,
      };
    });
  };

  const exportExcel = () => {
    exportExcelRequestUsingBudget(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DS_DE_NGHI_SU_DUNG_NGAN_SACH.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {})
      .finally(() => {});
  };

  const printPdf = (request_using_budget_id) => {
    exportPDFRequestUsingBudget(request_using_budget_id).then((result) => {
      window.open(result, '_blank');
    });
  };

  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
    if (isReload)
      setParams({
        is_active: 1,
        page: 1,
        itemsPerPage: 25,
      });
  };

  const handleSetErrorImport = (errorsImport) => {
    setErrorImport(errorsImport);
    setOpenModalImport(false);
    setOpenModalErrorImport(true);
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <RequestUsingBudgetFilter onChange={onFilter} />
        <RequestUsingBudgetTable
          loading={loading}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          total={total}
          onChange={onFilter}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          exportExcel={exportExcel}
          importExcel={() => setOpenModalImport(true)}
          printPdf={printPdf}
          onRefresh={loadRequestUsingBudget}
        />
      </div>
      {openModalImport && <ImportExcel onClose={handleCloseModalImport} handleSetErrorImport={handleSetErrorImport} />}
      {loadingExport && <Loading />}
      {openModalErrorImport && <ImportError errors={errorImport} onClose={() => setOpenModalErrorImport(false)} />}
    </React.Fragment>
  );
};

export default RequestUsingBudgetPage;
