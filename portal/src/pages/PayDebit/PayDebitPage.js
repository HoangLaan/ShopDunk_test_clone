import React, { useState, useCallback, useEffect } from 'react';

// Service
import { getListDebit, exportExcel } from './helpers/call-api';

// component

import DebitTable from './Components/PayDebitTable';
import DebitSummary from './Components/PayDebitSummary';
import PayDebitFilter from './Components/PayDebitFilter';
import { showToast, createDownloadFile } from 'utils/helpers';

const PayDebitPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    // debt_type:2
  });

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { items, itemsPerPage, page, totalItems, totalPages, meta = {} } = dataList;
  const loadListDebit = useCallback(() => {
    setLoading(true);
    getListDebit(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadListDebit, [loadListDebit]);

  const handleExportExcel = useCallback(() => {
    exportExcel(params)
      .then((res) => createDownloadFile(res?.data, 'pay_debt.xlsx'))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      });
  }, [params]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PayDebitFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
                page: 1,
              };
            });
          }}
        />
        <div className='bw_box_card bw_mt_2'>
          <DebitSummary data={items} statistic={meta} />
          <DebitTable
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
            onRefresh={loadListDebit}
            handleExportExcel={handleExportExcel}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PayDebitPage;
