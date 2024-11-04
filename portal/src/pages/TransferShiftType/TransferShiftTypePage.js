import React, { useState, useCallback, useEffect } from 'react';
import TransferShiftTypeFilter from './components/TransferShiftTypeFilter';
import TransferShiftTypeTable from './components/TransferShiftTypeTable';
import { getListTransferShiftType } from 'services/transfer-shift-type.service';

const TransferShiftTypePage = () => {
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

  const loadTransferShiftType = useCallback(() => {
    setLoading(true);
    getListTransferShiftType(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadTransferShiftType, [loadTransferShiftType]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <TransferShiftTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <TransferShiftTypeTable
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
          onRefresh={loadTransferShiftType}
        />
      </div>
    </React.Fragment>
  );
};

export default TransferShiftTypePage;
