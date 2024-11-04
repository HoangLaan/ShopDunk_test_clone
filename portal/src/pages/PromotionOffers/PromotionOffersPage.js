import React, { useState } from 'react';
import PromotionOffersFilter from './components/table/PromotionOffersFilter';
import { defaultPaging, defaultParams } from 'utils/helpers';
import PromotionOffersTable from './components/table/PromotionOffersTable';
import { getList } from 'services/promotion-offers.service';

const PromotionOffersPage = () => {
  const [params, setParams] = React.useState(defaultParams);
  const [dataList, setDataList] = React.useState(defaultPaging);
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = React.useCallback(() => {
    getList(params).then((data) => {
      setDataList(data);
    });
  }, [params]);

  React.useEffect(getData, [getData]);

  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  return (
    <div className='bw_main_wrapp'>
      <PromotionOffersFilter
        onClear={() => {
          setParams({
            search: '',
            offer_type: null,
            bussiness_id: null,
            company_id: null,
            ...defaultParams,

          });
        }}
        onChange={(value) => {
          setParams((prev) => ({
            ...prev,
            ...value,
          }));
        }}
      />
      <PromotionOffersTable
        data={items}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        totalPages={totalPages}
        onRefresh={getData}
        onChangePage={onChangePage}
      />
    </div>
  );
};

export default PromotionOffersPage;