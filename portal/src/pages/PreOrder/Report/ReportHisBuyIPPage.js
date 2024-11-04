import React, { useCallback, useEffect, useState } from 'react';
import { getDatHisBuyIP, exportExcel } from 'services/pre-order.service';
import { getErrorMessage } from 'utils';
import { createDownloadFile, showToast } from 'utils/helpers';
import ReportHisBuyIPFilter from './components/ReportHisBuyIPFilter';
import ReportHisBuyIPTable from './components/ReportHisBuyIPTable';
import { StyledCustomerCare } from 'pages/CustomerCare/utils/styles';

function ReportHisBuyIPPage() {
  const [params, setParams] = useState({
    keyword: null,
    page: 1,
    itemsPerPage: 25,
    is_all: 1,
  });
  const [loading, setLoading] = useState(true);

  const [dataList, setDataList] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const fetchData = useCallback(() => {
    setLoading(true);
    getDatHisBuyIP(params)
      .then(setDataList)
      .catch((error) => showToast.error(getErrorMessage(error)))
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(fetchData, [fetchData]);

  const handleExportExcel = useCallback(() => {
    exportExcel({ ...params, type: 1 })
      .then((res) => createDownloadFile(res?.data, 'customer.xlsx'))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      });
  }, [params]);

  return (
    <StyledCustomerCare>
      <div className='bw_main_wrapp'>
        <ReportHisBuyIPFilter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ReportHisBuyIPTable
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
          onChangeParams={({ is_buy_accessory, is_update_14, type, is_all = 0 }) => {
            setParams((prev) => ({
              ...prev,
              ...{
                is_buy_accessory,
                is_update_14,
                type,
                is_all,
              },
              ...{
                page: 1,
                keyword: '',
              },
            }));
          }}
          exportExcel={handleExportExcel}
        />
      </div>
    </StyledCustomerCare>
  );
}

export default ReportHisBuyIPPage;
