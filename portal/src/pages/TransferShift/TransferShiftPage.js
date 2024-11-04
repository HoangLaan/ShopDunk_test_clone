import React, { useState, useCallback, useEffect } from 'react';

import TransferShiftFilter from './components/TransferShiftFilter';
import TransferShiftTable from './components/TransferShiftTable';
import { getListTransferShift } from 'services/transfer-shift.service';

const TransferShiftPage = () => {
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
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadTransferShift = useCallback(() => {
    setLoading(true);
    getListTransferShift(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadTransferShift, [loadTransferShift]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <TransferShiftFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <TransferShiftTable
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
          onRefresh={loadTransferShift}
        />
      </div>
    </React.Fragment>
  );
};

export default TransferShiftPage;
