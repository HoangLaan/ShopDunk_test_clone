import React, { useCallback, useState } from 'react';

import TableRequestPurchaseOrder from 'pages/RequestPurchaseOrder/components/Tables/TableRequestPurchaseOrder';
import FilterRequestPurchaseOrder from 'pages/RequestPurchaseOrder/components/Filters/FilterRequestPurchaseOrder';
import { StyledRequestPurchase } from '../helpers/styles';

function RequestPurchaseOrder() {
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });

  const onChangePage = useCallback(
    (page) => {
      setParams({ ...params, page });
    },
    [params],
  );

  return (
    <StyledRequestPurchase>
      <div className='bw_main_wrapp'>
        <FilterRequestPurchaseOrder
          onChange={(p) => setParams({ ...params, ...p, page: 1 })}
          onClear={() =>
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
            })
          }
        />
        <TableRequestPurchaseOrder
          onChangeParams={(data) => {
            setParams((prev) => ({
              ...prev,
              ...data,
            }));
          }}
          params={params}
          setParams={setParams}
          onChangePage={onChangePage}
        />
      </div>
    </StyledRequestPurchase>
  );
}

export default RequestPurchaseOrder;
