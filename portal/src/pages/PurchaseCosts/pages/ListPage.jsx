import React, { useState, useCallback, useEffect } from 'react';
import servicePurchaseCost from 'services/purchase-cost.service';
import PurchaseCostsFilter from '../components/Filter';
import PurchaseCostsTable from '../components/TableData';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';

const ReceiveSlipPage = () => {
  const [listData, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages } = listData;
  const [params, setParams] = useState(defaultParams);

  const checkResult = (value, setValueIn, valueDefault) => {
    let result = valueDefault;
    if(value) {
      result = value;
    }
    setValueIn(result);
  }

  const loadListPurchaseCost = useCallback(() => {
    setLoading(true);
    servicePurchaseCost.getListPurchaseCost(params, 1)
      .then((res) => {
        checkResult(res, setDataList, {})
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadListPurchaseCost, [loadListPurchaseCost]);

  const onChange = (params) => {
    setParams((prev) => ({ ...prev, ...params }));
  };

  const handleDelete = (listId) => {
    servicePurchaseCost.deletePurchaseCost(listId)
      .then(() => {
        loadListPurchaseCost();
        showToast.success('Xóa thu chi thành công !');
      })
      .catch((error) => {
        showToast.error(error.message ?? 'Có lỗi xảy ra!');
      });
  };

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <PurchaseCostsFilter onChange={setParams} />
        <PurchaseCostsTable
          onChangePage={(page) => {
            onChange({ page });
          }}
          handleDelete={handleDelete}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          reload={loadListPurchaseCost}
        />
      </div>
    </React.Fragment>
  );
};

export default ReceiveSlipPage;
