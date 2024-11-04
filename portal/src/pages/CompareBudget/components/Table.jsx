import React, { useState } from 'react';
import { useMemo } from 'react';
import DataTable from 'components/shared/DataTable/index';
import CustomActions from './common/CustomActions';
import { formatPrice } from 'utils/index';
import { CURRENCY_UNIT } from '../helper/constants';
import { roundingNumber } from '../helper/index';

const CompareBudgetTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  exportExcel,
  sumRecord = {},
}) => {
  const [currencyUnit, setCurrencyUnit] = useState(CURRENCY_UNIT.MILLION);

  const divisor = useMemo(() => (currencyUnit === CURRENCY_UNIT.MILLION ? 1000000 : 1000), [currencyUnit]);

  const tableData = useMemo(() => {
    sumRecord.budget_name = `Tổng ngân sách cấp ${sumRecord?.budget_level}`;

    return data.concat(sumRecord);
  }, [sumRecord, data]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => {
          if (!_.budget_level) {
            return <span className='bw_text_wrap'>{index + 1}</span>;
          }
        },
      },
      {
        header: 'Mã ngân sách',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (_) => {
          return <span className={`bw_text_wrap ${_.budget_level ? 'bw_title_page' : ''}`}>{_.budget_code}</span>;
        },
      },
      {
        header: 'Tên ngân sách',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (_) => {
          return <span className={`bw_text_wrap ${_.budget_level ? 'bw_title_page' : ''}`}>{_.budget_name}</span>;
        },
      },
      {
        header: 'Ngân sách ban đầu',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          return (
            <span className={`bw_text_wrap ${item.budget_level ? 'bw_title_page' : ''}`}>
              {formatPrice(roundingNumber(item.total_budget_plan, divisor), false, ',')}
            </span>
          );
        },
      },
      {
        header: 'Ngân sách chuyển đến',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          return (
            <span className={`bw_text_wrap ${item.budget_level ? 'bw_title_page' : ''}`}>
              {formatPrice(roundingNumber(item.total_budget_to, divisor), false, ',')}
            </span>
          );
        },
      },
      {
        header: 'Ngân sách chuyển đi',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          return (
            <span className={`bw_text_wrap ${item.budget_level ? 'bw_title_page' : ''}`}>
              {formatPrice(roundingNumber(item.total_budget_from, divisor), false, ',')}
            </span>
          );
        },
      },
      {
        header: 'Ngân sách đã sử dụng',
        accessor: 'used_budget',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          return (
            <span className={`bw_text_wrap ${item.budget_level ? 'bw_title_page' : ''}`}>
              {formatPrice(roundingNumber(item.total_budget_used, divisor), false, ',')}
            </span>
          );
        },
      },
      {
        header: 'Ngân sách còn lại',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          const remaining =
            item.total_budget_plan + item.total_budget_to - item.total_budget_from - item.total_budget_used;
          return (
            <span className={`bw_text_wrap ${item.budget_level ? 'bw_title_page' : ''}`}>
              {formatPrice(roundingNumber(remaining, divisor), false, ',')}
            </span>
          );
        },
      },
    ],
    [divisor],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        type: 'success',
        outline: true,
        content: 'Xuất excel',
        permission: 'COMPARE_BUDGET_EXPORT',
        onClick: () => exportExcel(),
      },
    ];
  }, [exportExcel]);

  return (
    <div>
      <CustomActions actions={actions} permission={'COMPARE_BUDGET_FILTER'} onChangeFilter={setCurrencyUnit} />
      <DataTable
        loading={loading}
        noSelect
        columns={columns}
        data={tableData}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
    </div>
  );
};

export default CompareBudgetTable;
