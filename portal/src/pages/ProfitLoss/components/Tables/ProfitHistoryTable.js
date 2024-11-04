import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import profitLossService from 'services/profitLoss.service';
import { CHANGE_TYPE, PROFIT_LOSS_PERMISSION, RulePrice } from 'pages/ProfitLoss/utils/constants';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useForm } from 'react-hook-form';
import { formatPrice } from 'utils';
import { calculateDiscount } from 'pages/ProfitLoss/utils/helper';

const FIELD_LIST = 'list';

const ProfitLossTable = ({
  onChangePage,
  data = [],
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  loading,
  exportExcel,
  discountPrograms,
}) => {
  const columns = useMemo(() => {
    const topColumns = [
      {
        header: 'STT',
        accessor: 'product_code',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p, index) => index + 1,
      },
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_code',
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_name',
        formatter: (p) => (
          <div style={{ minWidth: '400px', maxWidth: '600px', whiteSpace: 'initial' }}>{p.product_name}</div>
        ),
      },
      {
        header: 'Giá NY Full Vat (P3)',
        accessor: 'listed_price_full_vat',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (item) => formatPrice(Math.round(item?.listed_price_full_vat || 0), false, ','),
      },
      {
        header: 'P1-VAT',
        style: { minWidth: '100px' },
        accessor: 'p1_subtract_vat',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (item) => formatPrice(Math.round(item?.p1_subtract_vat || 0), false, ','),
      },
      {
        header: 'Rebate 1.5% (*P1)',
        accessor: 'rebate',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (item) => formatPrice(Math.round(item?.rebate || 0), false, ','),
      },
    ];

    const dynamicColumns =
      discountPrograms?.map((program) => ({
        header: program.discount_program_name,
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        accessor: `dynamic_column_${program?.discount_program_id}`,
        formatter: (item) => {
          const discountProgram = item.discount_programs?.find(
            (_) => _.discount_program_id === program?.discount_program_id,
          );
          return discountProgram ? (
            formatPrice(discountProgram.estimated_discount_value, false, ',')
          ) : (
            <sapn className='bw_label_outline text-center bw_label_outline_warning'>Không áp dụng</sapn>
          );
        },
      })) || [];

    const bottomColumns = [
      {
        header: 'Net - VAT',
        style: { minWidth: '100px' },
        accessor: 'net_subtract_vat',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (p) => formatPrice(Math.round(p.net_subtract_vat || 0), false, ','),
      },
      {
        header: 'Giá Net Full VAT',
        accessor: 'net_full_vat',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (p) => formatPrice(Math.round(p.net_full_vat || 0), false, ','),
      },
      {
        header: 'Giá bán đề xuất',
        accessor: 'suggested_price',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (p) => formatPrice(Math.round(p.suggested_price || 0), false, ','),
      },
      {
        header: 'Lợi nhuận (%)',
        accessor: 'expected_profit_percentage',
        classNameBody: 'bw_text_right',
        classNameHeader: 'bw_text_center',
        formatter: (p) => `${p.expected_profit_percentage} %`,
      },
      {
        header: 'Số tiền lợi nhuận dự kiến',
        accessor: 'expected_profit_money',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => formatPrice(Math.round(p.expected_profit_money || 0), false, ','),
      },
      {
        header: 'Người thực hiện tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Thời gian tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
    ];

    return [...topColumns, ...dynamicColumns, ...bottomColumns];
  }, [discountPrograms]);

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'primary',
        style: { marginLeft: '5px' },
        content: 'Xuất Excel',
        permission: PROFIT_LOSS_PERMISSION.EXPORT,
        onClick: () => exportExcel(),
      },
    ],
    [],
  );

  return (
    <DataTable
      noSelect
      actions={actions}
      loading={loading}
      columns={columns}
      data={data}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
    />
  );
};

export default ProfitLossTable;
