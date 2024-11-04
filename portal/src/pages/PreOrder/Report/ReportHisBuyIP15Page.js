import React, { useCallback, useEffect, useState } from 'react';
import { getDatHisBuyIP15 } from 'services/pre-order.service';
import { getErrorMessage } from 'utils';
import { showToast } from 'utils/helpers';
import ReportHisBuyIP15Filter from './components/ReportHisBuyIP15Filter';
import ReportHisBuyIP15Table from './components/ReportHisBuyIP15Table';
import { StyledCustomerCare } from 'pages/CustomerCare/utils/styles';
import { reportBuyIp15 } from './const';

const ReportHisBuyIP15Page = () => {
  const [params, setParams] = useState({
    keyword: null,
    page: 1,
    itemsPerPage: 25,
    tab_active: 1,
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
    getDatHisBuyIP15(params)
      .then(setDataList)
      .catch((error) => showToast.error(getErrorMessage(error)))
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(fetchData, [fetchData]);

  const title = (
    <div>
      {reportBuyIp15 && Object.values(reportBuyIp15)?.map((value) => {
        return (
          <button
            className={params?.tab_active === reportBuyIp15[value.key]?.value ? reportBuyIp15[value.key]?.classActive : reportBuyIp15[value.key]?.classNone}
            style={{ marginRight: '10px' }}
            onClick={() => setParams((prev) => ({ ...prev, tab_active: reportBuyIp15[value.key].value }))}
          >
            {reportBuyIp15[value.key]?.label}
          </button>
        )
      })}
    </div>
  );

  return (
    <StyledCustomerCare>
      <div className='bw_main_wrapp'>
        <ReportHisBuyIP15Filter
          onChange={(e) => {
            setParams((prev) => {
              return {
                ...prev,
                ...e,
              };
            });
          }}
        />
        <ReportHisBuyIP15Table
          title={title}
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
          onChangeParams={({ is_buy_accessory, is_update_14, type }) => {
            setParams((prev) => ({
              ...prev,
              ...{
                is_buy_accessory,
                is_update_14,
                type,
              },
              ...{
                page: 1,
                keyword: '',
              },
            }));
          }}
        />
      </div>
    </StyledCustomerCare>
  );
}

export default ReportHisBuyIP15Page;
