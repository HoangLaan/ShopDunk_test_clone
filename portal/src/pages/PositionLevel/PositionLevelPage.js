import React, { useState, useCallback, useEffect } from 'react';
import PositionLevelTable from 'pages/PositionLevel/components/PositionLevelTable';
import PositionLevelFilter from 'pages/PositionLevel/components/PositionLevelFilter';
import { getListPositionLevel } from 'services/position-level.service';
import ConfirmModal from 'components/shared/ConfirmDeleteModal/index';

const PositionLevelPage = () => {
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

  const loadListPositionLevel = useCallback(() => {
    setLoading(true);
    getListPositionLevel(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadListPositionLevel, [loadListPositionLevel]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PositionLevelFilter
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
        <PositionLevelTable
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
          onRefresh={loadListPositionLevel}
        />
      </div>
      <ConfirmModal />
    </React.Fragment>
  );
};

export default PositionLevelPage;
