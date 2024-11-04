import React, { useState, useCallback, useEffect } from 'react';
import InternalTransferTable from 'pages/InternalTransfer/components/InternalTransferTable';
import InternalTransferFilter from 'pages/InternalTransfer/components/InternalTransferFilter';
import { getList } from 'services/internal-transfer.service';
import ConfirmModal from 'components/shared/ConfirmDeleteModal/index';

const InternalTransferPage = () => {
  const [loading, setLoading] = useState(false);
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

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadListInternalTransfer = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadListInternalTransfer, [loadListInternalTransfer]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <InternalTransferFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <InternalTransferTable
          onChangeParams={(data) => {
            setParams((prev) => ({
              ...prev,
              ...data,
            }));
          }}
          loading={loading}
          data={items}
          totalPages={parseInt(totalPages)}
          itemsPerPage={parseInt(itemsPerPage)}
          page={parseInt(page)}
          totalItems={parseInt(totalItems)}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadListInternalTransfer}
        />
      </div>
      <ConfirmModal />
    </React.Fragment>
  );
};

export default InternalTransferPage;
