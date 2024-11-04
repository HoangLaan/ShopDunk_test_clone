import React, { useState, useCallback, useEffect } from 'react';

import OrderStatusTable from './components/main-page/OrderStatusTable';
import OrderStatusFilter from './components/main-page/OrderStatusFilter';
import { getListOrderStatus } from 'services/order-status.service';

const OrderStatusPage = () => {
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
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

  const loadOrderStatus = useCallback(() => {
    setLoading(true);
    getListOrderStatus(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadOrderStatus, [loadOrderStatus]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <OrderStatusFilter
          onClear={() => {
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
            });
          }}
          onChange={(e) => {
            setParams({
              ...params,
              ...e,
            });
          }}
        />
        <OrderStatusTable
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
          onRefresh={loadOrderStatus}
        />
      </div>
      {/* <ConfirmModal /> */}
    </React.Fragment>
  );
};

export default OrderStatusPage;
