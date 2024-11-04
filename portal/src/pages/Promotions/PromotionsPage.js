import React from 'react';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { PROMOTION_TYPE } from './utils/constants';
import { getList, getTotalPromotion } from 'services/promotions.service';
import PromotionsFilter from './components/table/PromotionsFilter';
import PromotionsTable from './components/table/PromotionsTable';

const PromotionsPage = () => {
  const [params, setParams] = React.useState(defaultParams);
  const [dataList, setDataList] = React.useState(defaultPaging);
  const [total, setTotal] = React.useState({})
  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = React.useCallback(() => {
    getList(params).then((data) => {
      setDataList(data);
    });
  }, [params]);
  React.useEffect(getData, [getData]);

  const getDataTotal = React.useCallback(() => {
    getTotalPromotion().then((res) => {
      if(res) {
        setTotal(res);
      }
    });
  }, []);
  React.useEffect(getDataTotal, [getDataTotal]);

  const onChangePage = (page) => setParams((prev) => ({ ...prev, page }));

  const title = (
    <div>
      {PROMOTION_TYPE && Object.values(PROMOTION_TYPE)?.map((value) => {
        return (
          <button
          className={params?.apply_status === PROMOTION_TYPE[value.key].value ?  PROMOTION_TYPE[value.key].classActive : PROMOTION_TYPE[value.key].classNone }
          style={{marginRight: '10px'}}
          onClick={() => setParams((prev) => ({ ...prev, apply_status: PROMOTION_TYPE[value.key].value }))}>
          {PROMOTION_TYPE[value.key].label + total[value.key]}
        </button>
        )
      }) }
    </div>
  );

  return (
    <div className='bw_main_wrapp'>
      <PromotionsFilter
        onClear={() => {
          setParams(defaultParams);
        }}
        onChange={(value) => {
          setParams((prev) => ({
            ...prev,
            ...value,
          }));
        }}
      />
      <PromotionsTable
        title={title}
        onChangePage={onChangePage}
        onRefresh={getData}
        data={items}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PromotionsPage;
