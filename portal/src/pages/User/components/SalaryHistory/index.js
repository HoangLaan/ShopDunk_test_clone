import React, { useState, useCallback, useEffect } from 'react';
import { showToast } from 'utils/helpers';
import { useFormContext } from 'react-hook-form';

import { defaultPaging } from 'utils/helpers';
import { getListSalaryHistory } from 'services/users.service';

import Filter from './Filter';
import Table from './Table';

const SalaryHistory = () => {
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
      getListSalaryHistory(user_name, params)
        .then(setDataList)
        .catch((err) => {
          showToast.error(err?.message ?? 'Có lỗi xảy ra', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
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

export default SalaryHistory;
