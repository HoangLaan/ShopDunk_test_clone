import React, { useState, useCallback, useEffect } from 'react';

import ClusterFilter from './components/ClusterFilter';
import ClusterTable from './components/ClusterTable';
import { getListCluster, getOptionsCluster } from 'services/cluster.service';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const ClusterPage = () => {
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
  const [businessOption, setBusinessOption] = useState([]);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadCluster = useCallback(() => {
    setLoading(true);
    getListCluster(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadCluster, [loadCluster]);
  const loadBusiness = useCallback(() => {
    getOptionsCluster({}).then((res) => {
      setBusinessOption(mapDataOptions4SelectCustom(res, 'id', 'name'));
    });
  }, []);
  useEffect(() => {
    loadBusiness();
  }, [loadBusiness]);

  useEffect(loadCluster, [loadCluster]);
  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ClusterFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          businessOption={businessOption}
        />
        <ClusterTable
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
          onRefresh={loadCluster}
        />
      </div>
    </React.Fragment>
  );
};

export default ClusterPage;
