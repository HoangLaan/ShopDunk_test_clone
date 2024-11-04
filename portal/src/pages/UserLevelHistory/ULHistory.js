import React, { useState, useEffect, useCallback } from 'react';
import { showToast } from 'utils/helpers';
import { getList } from 'services/user-level-history.service';
import { defaultPaging } from 'utils/helpers';
import UserLevelHistoryFilter from './components/UserLevelHistoryFilter';
import UserLevelHistoryTable from './components/UserLevelHistoryTable';

export default function ULHistory({ userId }) {
  const [params, setParams] = useState({
    from_date: null,
    to_date: null,
    keyword: '',
    page: 1,
    itemsPerPage: 25,
  });
  const [dataList, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(true);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadData = useCallback(() => {
    setLoading(true);
    getList({ ...params, userId: userId })
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
  }, [params, userId]);
  useEffect(loadData, [loadData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        {!userId ? (
          <UserLevelHistoryFilter
            onChange={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  ...e,
                };
              });
            }}
          />
        ) : null}

        <UserLevelHistoryTable
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
}
