import { useAuth } from 'context/AuthProvider';
import React, { useCallback, useEffect, useState } from 'react';
import BrandFilter from './components/BrandFilter';
import BrandTable from './components/BrandTable';
import { getListBrand } from 'services/brand.service';

const Brand = () => {
  const { user } = useAuth();
  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 25,
    is_active: 1,
    company_id: user?.isAdministrator === 1 ? null : user?.company_id,
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

  const getData = useCallback(() => {
    setLoading(true);
    getListBrand(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(getData, [getData]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <BrandFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <BrandTable
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
          onRefresh={getData}
        />
      </div>
    </React.Fragment>
  );
};

export default Brand;
