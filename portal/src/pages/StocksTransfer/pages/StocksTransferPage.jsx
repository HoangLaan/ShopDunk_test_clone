import React, { useCallback, useState, useEffect } from 'react';
import { deleteItem, getListStocksTransfer } from '../helpers/call-api';
import StocksTransferTable from '../components/StocksTransferTable';
import StocksTransferFilter from '../components/StocksTransferFilter';
import { notification } from 'antd';
import { showToast } from 'utils/helpers';

const StocksTransferPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
  });
  const [dataStocksTransfer, setDataStocksTransfer] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataStocksTransfer;

  const loadStocksTransfer = useCallback(() => {
    setLoading(true);
    getListStocksTransfer(params)
      .then(setDataStocksTransfer)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadStocksTransfer, [loadStocksTransfer]);

  const handleDelete = async (stocksTransfer) => {
    deleteItem(stocksTransfer?.stocks_transfer_id)
      .then(() => {
        loadStocksTransfer();
        showToast.success('Xoá dữ liệu thành công');
      })
      .catch((error) => {
        let { message } = error;
        if (error.message) {
          showToast.error(message + '');
        }
      });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StocksTransferFilter
          onChange={(p) => {
            setParams({
              ...params,
              ...p,
            });
          }}
        />
        <StocksTransferTable
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
          handleDelete={handleDelete}
          handleLoad={loadStocksTransfer}
          loading={loading}
        />
      </div>
    </React.Fragment>
  );
};

export default StocksTransferPage;
