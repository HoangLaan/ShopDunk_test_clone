import React, { useState, useCallback, useEffect } from 'react';
import { getListBank } from 'services/bank.service';
import BankTable from './components/main/BankTable';
import BankFilter from './components/main/BankFilter';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';

const BankPage = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [dataList, setDataList] = useState(defaultPaging);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const loadData = useCallback(() => {
    setLoading(true);
    getListBank(params)
      .then(setDataList)
      .catch((err) => {
        showToast.error(err?.message ?? 'Có lỗi xảy ra');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  useEffect(loadData, [loadData]);

  return (
    <React.Fragment>
      <div class='bw_main_wrapp'>
        <BankFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <BankTable
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
          onRefresh={loadData}
        />
      </div>
    </React.Fragment>
  );
};

export default BankPage;
