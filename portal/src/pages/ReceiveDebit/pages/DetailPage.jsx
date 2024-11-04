import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { getList, getDetail, exportExcelDetail } from 'services/receive-debit.service';
import { defaultPaging, showToast } from 'utils/helpers';
import { useLocation } from 'react-router-dom';

import Filter from '../components/FilterDetail';
import Table from '../components/TableDetail';
import { DefaultParams, DefaultFilter } from '../utils/constant';
import moment from 'moment';
import { Spin } from 'antd';

const ReceiveDebitDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [params, setParams] = useState({
    ...DefaultParams,
    customer_id: queryParams.get('customer_id'),
    customer_type: queryParams.get('customer_type'),
  });

  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExportExcel, setLoadingExportExcel] = useState(false);

  let { items, itemsPerPage, page, totalItems, totalPages, meta = {} } = dataList;

  // add begin money row
  const dataItems = useMemo(() => {
    items.unshift({
      explain: 'Số dư đầu kỳ',
      credit_begin_money: meta.credit_begin - meta.debt_begin > 0 ? meta.credit_begin - meta.debt_begin : 0,
      debt_begin_money: meta.credit_begin - meta.debt_begin < 0 ? meta.debt_begin - meta.credit_begin : 0,
      remaining: meta.credit_begin - meta.debt_begin,
    });
    return items;
  }, [items, meta]);

  const getData = useCallback(() => {
    setLoading(true);
    getDetail(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const handleExportExcel = () => {
    setLoadingExportExcel(true);
    exportExcelDetail(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        const createdDate = moment().format('DDMMYYYY');
        link.setAttribute('download', `chi_tiet_cong_no_phai_thu_${createdDate}.xlsx`);
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
          defaultFilter={{
            ...DefaultFilter,
            customer_id: queryParams.get('customer_id'),
            customer_type: queryParams.get('customer_type'),
          }}
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
          data={dataItems}
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

export default ReceiveDebitDetail;
