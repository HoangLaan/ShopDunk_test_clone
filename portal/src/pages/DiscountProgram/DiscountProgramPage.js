import React from 'react';
import dayjs from 'dayjs';

import DiscountProgramFilter from './components/DiscountProgramFilter';
import DiscountProgramTable from './components/DiscountProgramTable';

import { ResetStyle } from './ultils/styles';
import { defaultPaging, defaultParams } from 'utils/helpers';
import { getList, getStatitic } from 'services/discount-program.service';

const DiscountProgramPage = () => {
  const [params, setParams] = React.useState({
    ...defaultParams,
    is_debit: 0,
    apply_date_from: dayjs().subtract(30, 'day').format('DD/MM/YYYY'),
    apply_date_to: dayjs().format('DD/MM/YYYY'),
    tab: 0,
  });
  const [dataList, setDataList] = React.useState(defaultPaging);
  const [statiticData, setStatiticData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

  const getData = React.useCallback(() => {
    setLoading(true);

    getStatitic(
      Object.keys(params)
        .filter((key) => +params[key] !== -1)
        .reduce((obj, key) => {
          obj[key] = params[key];
          return obj;
        }, {}),
    )
      .then((data) => {
        setStatiticData(data);

        getList(params)
          .then((data) => {
            setDataList(data);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);
  React.useEffect(getData, [getData]);

  return (
    <ResetStyle className='bw_main_wrapp'>
      <DiscountProgramFilter
        onClear={() => {
          setParams({
            ...params,
            search: null,
            is_active: 1,
            is_debit: 0,
            apply_date_from: dayjs().subtract(30, 'day').format('DD/MM/YYYY'),
            apply_date_to: dayjs().format('DD/MM/YYYY'),
            tab: 0,
          });
        }}
        onChange={(value) =>
          setParams((prev) => ({
            ...prev,
            ...value,
          }))
        }
        statiticData={statiticData}
        loading={loading}
      />
      <DiscountProgramTable
        onRefresh={getData}
        data={items}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        totalPages={totalPages}
        loading={loading}
      />
    </ResetStyle>
  );
};

export default DiscountProgramPage;
