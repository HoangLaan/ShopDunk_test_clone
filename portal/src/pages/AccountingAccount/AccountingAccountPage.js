import React, { useState, useCallback, useEffect } from 'react';

import AccountingAccountFilter from './components/AccountingAccountFilter';
import AccountingAccountTable from './components/AccountingAccountTable';
import { getListAccountingAccount, exportExcelAccountingAccount } from 'services/accounting-account.service';
import Loading from 'components/shared/Loading/index';
import moment from 'moment';
import { notification } from 'antd';
import ImportExcel from './components/modal/ImportExcel';
import ImportError from './components/modal/ImportError';
import { isEmpty } from 'lodash';
import { INIT_FORM_SEARCH } from './utils/constants';
const AccountingAccountPage = () => {
  const [params, setParams] = useState(INIT_FORM_SEARCH);
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [openModalImport, setOpenModalImport] = useState(null);
  const [openModalErrorImport, setOpenModalErrorImport] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorImport, setErrorImport] = useState(null);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadAccountingAccount = useCallback(() => {
    setLoading(true);
    getListAccountingAccount(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadAccountingAccount, [loadAccountingAccount]);
  const handleCloseModalImport = (isReload = false) => {
    setOpenModalImport(false);
    if (isReload) loadAccountingAccount();
  };
  const handleSetErrorImport = (errorsImport) => {
    setErrorImport(errorsImport);
    setOpenModalImport(false);
    setOpenModalErrorImport(true);
  };
  const exportExcel = () => {
    setLoadingExport(true);
    exportExcelAccountingAccount(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `Tai_khoan_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => notification.error({ message: error.message || 'Lỗi tải tập tin.' }))
      .finally(() => setLoadingExport(false));
  };
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <AccountingAccountFilter
          onChange={(e) => {
            if (isEmpty(e)) {
              setParams(INIT_FORM_SEARCH);
            }
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <AccountingAccountTable
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
          onRefresh={loadAccountingAccount}
          exportExcel={exportExcel}
          importExcel={() => setOpenModalImport(true)}
          params={params}
        />
      </div>
      {openModalImport && <ImportExcel onClose={handleCloseModalImport} handleSetErrorImport={handleSetErrorImport} />}
      {loadingExport && <Loading />}
      {openModalErrorImport && <ImportError errors={errorImport} onClose={() => setOpenModalErrorImport(false)} />}
    </React.Fragment>
  );
};

export default AccountingAccountPage;
