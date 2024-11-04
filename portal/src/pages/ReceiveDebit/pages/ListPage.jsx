import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { getList, exportExcel } from 'services/receive-debit.service';
import { defaultPaging, showToast } from 'utils/helpers';

import Filter from '../components/Filter';
import Table from '../components/Table';
import { DefaultParams } from '../utils/constant';
import moment from 'moment';
import { Spin } from 'antd';

const ReceiveDebitList = () => {
  const [params, setParams] = useState(DefaultParams);
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExportExcel, setLoadingExportExcel] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages, meta = {} } = dataList;

  const getData = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleExportExcel = () => {
    setLoadingExportExcel(true);
    exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `ds_cong_no_phai_thu_${createdDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => showToast.error(error.message ?? 'Lỗi tải tập tin.'))
      .finally(() => {
        setLoadingExportExcel(false);
      });
  };

  useEffect(getData, [getData]);

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 60px)' }}>
      <div class='bw_main_wrapp'>
        <Filter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <Table
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
          loading={loading}
          onRefresh={getData}
          handleExportExcel={handleExportExcel}
          sumRecord={meta}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: loadingExportExcel ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Spin />
      </div>
    </div>
  );
};

export default ReceiveDebitList;
