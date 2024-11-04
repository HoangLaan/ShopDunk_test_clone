import React, { useState, useCallback, useEffect } from 'react';

import { getListAnnounceType } from 'services/announce-type.service';
import AnnounceTypeTable from './components/main/AnnounceTypeTable';
import AnnounceTypeFilter from './components/main/AnnounceTypeFilter';

const AnnounceTypePage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    is_active: 1,
    is_company: 2,
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

  const loadAnnounceType = useCallback(() => {
    setLoading(true);
    getListAnnounceType(params)
      .then(setDataList)
      .catch((_) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadAnnounceType, [loadAnnounceType]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <AnnounceTypeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <AnnounceTypeTable
          loading={loading}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onRefresh={loadAnnounceType}
        />
      </div>
    </React.Fragment>
  );
};

export default AnnounceTypePage;
