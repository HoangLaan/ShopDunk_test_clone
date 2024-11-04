import React, { useCallback, useEffect, useState } from 'react';
import Filter from './components/Filter';
import Table from './components/Table';
import { getInterestCus, exportExcel } from 'services/pre-order.service';
import { createDownloadFile, showToast } from 'utils/helpers';
import { getErrorMessage } from 'utils';

function InterestCustomerPage() {
  const [params, setParams] = useState({
    keyword: null,
    page: 1,
    itemsPerPage: 25,
  });
  const onClearParams = () => setParams({ keyword: null, page: 1, itemsPerPage: 25 });

  const [loading, setLoading] = useState(true);

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    meta: {},
  });
  const loadData = useCallback(() => {
    setLoading(true);
    getInterestCus(params)
      .then(setDataList)
      .catch((error) => showToast.error(getErrorMessage(error)))
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  const { meta, items, itemsPerPage, page, totalItems, totalPages } = dataList;
  useEffect(loadData, [loadData]);

  const handleExportExcel = useCallback(() => {
    exportExcel({...params, type: 2})
    .then((res) => createDownloadFile(res?.data, 'customer.xlsx'))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      })
  }, [params]);

  return (
    <React.Fragment>
      <div className='bw_main_wrapp'>
        <Filter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          onClearParams={onClearParams}
        />
        <Table
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
          onChangeParams={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
          meta={meta}
          data={items}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          page={page}
          totalItems={totalItems}
          loading={loading}
          exportExcel={handleExportExcel}
        />
      </div>
    </React.Fragment>
  );
}

export default InterestCustomerPage;
