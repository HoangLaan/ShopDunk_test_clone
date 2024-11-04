import React, { useState, useCallback, useEffect } from 'react';

import { getListPurchaseRequisition } from 'services/purchase-requisition.service';
import PurchaseRequisitionTable from './components/main/PurchaseRequisitionTable';
import PurchaseRequisitionFilter from './components/main/PurchaseRequisitionFilter';
import { StyledPR } from './utils/styles';
import { REVIEW_TYPES } from './utils/constants';

const PurchaseRequisitionPage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
    review_status: 0,
  });
  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadPurchaseRequisition = useCallback(() => {
    params.department_request_id = params.department_request_id?.value
      ? params.department_request_id?.value
      : params.department_request_id;
    params.manufacturer_id = params.manufacturer_id?.value ? params.manufacturer_id?.value : params.manufacturer_id;
    params.business_request_id = params.business_request_id?.value
      ? params.business_request_id?.value
      : params.business_request_id;
    setLoading(true);
    getListPurchaseRequisition(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadPurchaseRequisition, [loadPurchaseRequisition]);

  return (
    <StyledPR>
      <div className='bw_main_wrapp'>
        <PurchaseRequisitionFilter
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
        <PurchaseRequisitionTable
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangeParams={(data) => {
            setParams((prev) => ({
              ...prev,
              ...data,
            }));
          }}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          params={params}
          onRefresh={loadPurchaseRequisition}
        />
      </div>
    </StyledPR>
  );
};

export default PurchaseRequisitionPage;
