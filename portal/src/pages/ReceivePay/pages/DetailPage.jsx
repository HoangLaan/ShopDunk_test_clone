import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { getList, getDetail, exportExcelDetail } from 'services/receive-pay.service';
import { defaultPaging, showToast } from 'utils/helpers';
import { useLocation } from 'react-router-dom';

import Filter from '../components/FilterDetail';
import Table from '../components/TableDetail';
import { DefaultParams, DefaultFilter } from '../utils/constant';
import moment from 'moment';
import { Spin } from 'antd';

const ReceivePayDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [params, setParams] = useState({
    ...DefaultParams,
    supplier_id: queryParams.get('supplier_id'),
    customer_type: queryParams.get('customer_type'),
  });

  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const [loadingExportExcel, setLoadingExportExcel] = useState(false);
  const [startDate, setStartDate] = useState('...');
  const [endDate, setEndDate] = useState('...');

  const { items, itemsPerPage, page, totalItems, totalPages, meta = {} } = dataList;

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
        link.setAttribute('download', `chi_tiet_cong_no_phai_tra_${createdDate}.xlsx`);
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
        <div style={{ textAlign: 'center', margin: '0 0 20px 0' }}>
          <h1 style={{ fontSize: 'x-large', fontWeight: '600', padding: '10px' }}>
            CHI TIẾT CÔNG NỢ PHẢI TRẢ ĐỐI TƯỢNG
          </h1>
          <h3 style={{ margin: '0 0 10px 0' }}>
            Tài khoản: 331, Đối tượng: {items?.[0]?.customer_name}, Từ ngày {startDate} đến ngày {endDate}
          </h3>
        </div>
        <Filter
          defaultFilter={{
            ...DefaultFilter,
            supplier_id: queryParams.get('supplier_id'),
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
          setStartDate={setStartDate}
          setEndDate={setEndDate}
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

export default ReceivePayDetail;
