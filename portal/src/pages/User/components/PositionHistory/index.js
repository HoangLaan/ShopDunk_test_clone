import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { defaultPaging, showToast } from 'utils/helpers';
import { getListPositionHistory } from 'services/users.service';

import Filter from './Filter';
import Table from './Table';

const PositionHistory = () => {
  const methods = useFormContext();
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);
  const user_name = methods.watch('user_name');

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadData = useCallback(() => {
    if (user_name) {
      setLoading(true);
      getListPositionHistory(user_name, params)
        .then(setDataList)
        .catch((err) => {
          showToast.error(err?.message ?? 'Có lỗi xảy ra');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params, user_name]);
  useEffect(loadData, [loadData]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <Filter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <Table
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
        />
      </div>
    </React.Fragment>
  );
};

export default PositionHistory;
