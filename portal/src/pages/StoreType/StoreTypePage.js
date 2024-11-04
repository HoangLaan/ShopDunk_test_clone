import React, { useState, useCallback, useEffect } from 'react';
import { showToast } from 'utils/helpers';

import StoreTypeFilter from './components/StoreTypeFilter';
import StoreTypeTable from './components/StoreTypeTable';
import { getStoreTypeList } from 'services/store-type.service';

const StoreTypePage = () => {
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
    getStoreTypeList(params)
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
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <StoreTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <StoreTypeTable
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

export default StoreTypePage;