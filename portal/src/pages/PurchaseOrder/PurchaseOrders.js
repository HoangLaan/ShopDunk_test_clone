import React, { useCallback, useEffect, useState } from 'react';
import { getListPurchaseOrder } from './helpers/call-api';
import PurchaseOrdersFilter from './components/PurchaseOrdersFilter';
import PurchaseOrdersTable from './components/PurchaseOrdersTable';
import { StyledPurchaseOrder } from './helpers/styles';

const PurchaseOrders = () => {
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

  const getData = useCallback(() => {
    setLoading(true);
    getListPurchaseOrder(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <StyledPurchaseOrder>
      <div class='bw_main_wrapp'>
        <PurchaseOrdersFilter
          onClear={() => {
            setParams({
              page: 1,
              itemsPerPage: 25,
              is_active: 1,
            });
          }}
          onChange={(e) => setParams((prev) => ({ ...prev, ...e }))}
        />
        <PurchaseOrdersTable
          onChangePage={(page) => setParams((prev) => ({ ...prev, page }))}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          onRefresh={getData}
          params={params}
          setParams={setParams}
          onChangeParams={(data) => {
            setParams((prev) => ({
              ...prev,
              ...data,
            }));
          }}
        />
      </div>
    </StyledPurchaseOrder>
  );
};

export default PurchaseOrders;
