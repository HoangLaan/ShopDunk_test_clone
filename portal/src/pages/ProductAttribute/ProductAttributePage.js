import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
// services
import { getList } from 'services/product-attribute.service';
//components
import ProductAttributeFilter from './components/ProductAttributeFilter';
import ProductAttributeTable from './components/ProductAttributeTable';

const ProductAttributePage = () => {
  const methods = useFormContext();
  const [params, setParams] = useState({
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

  const loadProductAttribute = useCallback(() => {
    setLoading(true);
    getList(params)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadProductAttribute, [loadProductAttribute]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <ProductAttributeFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ProductAttributeTable
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
          onRefresh={loadProductAttribute}
        />
      </div>
    </React.Fragment>
  );
};

export default ProductAttributePage;
