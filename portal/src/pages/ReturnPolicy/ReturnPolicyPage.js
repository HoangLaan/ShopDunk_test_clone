import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReturnPolicyFilter from './components/ReturnPolicyFilter';
import ReturnPolicyTable from './components/ReturnPolicyTable';
import { getReturnPolicyList } from 'services/return-policy.service';
import { showToast } from 'utils/helpers';

const ReturnPolicyPage = () => {
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
  const loadData = useCallback(() => {
    setLoading(true);
    getReturnPolicyList(params)
      .then(setDataList)
      .catch((err) => {
        showToast.error(err?.message ?? 'Có lỗi xảy ra');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <ReturnPolicyFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ReturnPolicyTable
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
          onRefresh={loadData}
        />
      </div>
    </React.Fragment>
  );
};

export default ReturnPolicyPage;
