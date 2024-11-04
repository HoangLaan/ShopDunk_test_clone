import React, { useState, useCallback, useEffect } from 'react';
import AreaTable from 'pages/Area/components/AreaTable';
import AreaFilter from 'pages/Area/components/AreaFilter';
import { getList } from 'services/area.service';
import ConfirmModal from 'components/shared/ConfirmDeleteModal/index';

const AreaPage = () => {
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

  const loadListArea = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadListArea, [loadListArea]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <AreaFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          onClear={(e) => {
            setParams({
              is_active: 1,
              page: 1,
              itemsPerPage: 25,
            });
          }}
        />
        <AreaTable
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
          onRefresh={loadListArea}
        />
      </div>
      <ConfirmModal />
    </React.Fragment>
  );
};

export default AreaPage;
