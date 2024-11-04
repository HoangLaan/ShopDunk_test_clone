import React, { useState, useCallback, useEffect } from 'react';

// Service
import { getListTimeKeepingDateConfirm } from './helpers/call-api';

// component
import DateConfirmTimeKeepingFilter from 'pages/DateCofirmTimeKeeping/Components/DateConfirmTimeKeepingFilter';
import DateConfirmTimeKeepingTable from 'pages/DateCofirmTimeKeeping/Components/DateConfirmTimeKeepingTable';
import { defaultPaging, defaultParams } from 'utils/helpers';

const DateConfirmTimeKeeping = () => {
  const [params, setParams] = useState(defaultParams);

  const [dataList, setDataList] = useState(defaultPaging);

  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadDateConfirmTimeKeeping = useCallback(() => {
    setLoading(true);
    getListTimeKeepingDateConfirm(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadDateConfirmTimeKeeping, [loadDateConfirmTimeKeeping]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <DateConfirmTimeKeepingFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <DateConfirmTimeKeepingTable
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
          onRefresh={loadDateConfirmTimeKeeping}
        />
      </div>
    </React.Fragment>
  );
};

export default DateConfirmTimeKeeping;
