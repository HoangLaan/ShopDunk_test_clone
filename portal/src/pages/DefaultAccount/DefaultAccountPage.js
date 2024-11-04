import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { notification } from 'antd';
import DefaultAccountFilter from './components/DefaultAccountFilter';
import DefaultAccountTable from './components/DefaultAccountTable';
import { exportExcelDefaultAccount, getListDefaultAccount } from 'services/default-account.service';
import Loading from 'components/shared/Loading/index';

const DefaultAccountPage = () => {
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
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadDefaultAccount = useCallback(() => {
    setLoading(true);
    getListDefaultAccount(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const exportExcel = () => {
    setLoadingExport(true);
    exportExcelDefaultAccount(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const configDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `Default_Account_${configDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => notification.error({ message: error.message || 'Lỗi tải tập tin.' }))
      .finally((done) => setLoadingExport(false));
  };

  useEffect(loadDefaultAccount, [loadDefaultAccount]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <DefaultAccountFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                page: 1,
                ...e,
              };
            });
          }}
        />
        <DefaultAccountTable
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
          exportExcel={() => exportExcel()}
          onRefresh={loadDefaultAccount}
        />
        {loadingExport && <Loading />}
      </div>
    </React.Fragment>
  );
};

export default DefaultAccountPage;
