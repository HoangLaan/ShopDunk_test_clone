import React, { useState, useCallback, useEffect } from 'react';
import TimeKeepingClaimTypeTable from 'pages/TimeKeepingClaimType/components/TimeKeepingClaimTypeTable';
import TimeKeepingClaimTypeFilter from 'pages/TimeKeepingClaimType/components/TimeKeepingClaimTypeFilter';
import { getList } from 'services/time-keeping-claim-type.service';
import ConfirmModal from 'components/shared/ConfirmDeleteModal/index';

const TimeKeepingClaimTypePage = () => {
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

  const loadListTimeKeepingClaimType = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadListTimeKeepingClaimType, [loadListTimeKeepingClaimType]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <TimeKeepingClaimTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <TimeKeepingClaimTypeTable
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
          onRefresh={loadListTimeKeepingClaimType}
        />
      </div>
      <ConfirmModal />
    </React.Fragment>
  );
};

export default TimeKeepingClaimTypePage;
