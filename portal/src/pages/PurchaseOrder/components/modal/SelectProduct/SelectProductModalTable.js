import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import pick from 'lodash/pick';

function SelectProductModalTable({ data, totalPages, itemsPerPage, page, totalItems, onChangePage }) {
  const methods = useFormContext();
  const columns = useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
      },
      {
        header: 'Hãng',
        accessor: 'manufacture_name',
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={[]}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(dataSelect) => {
        let oldDataSelect = methods.watch('product_list');
        if (oldDataSelect?.length > 0) {
          //get element from oldDataSelect in dataSelect
          oldDataSelect = dataSelect.filter((e) => !oldDataSelect.find((x) => x?.product_id === e?.product_id));

          //merge oldDataSelect and dataSelect by product_id
          dataSelect = dataSelect.map((e) => {
            const oldData = oldDataSelect.find((x) => x?.product_id === e?.product_id);
            return {
              ...e,
              ...oldData,
            };
          });
        }

        const list = dataSelect?.map((dataSelectItem, idx) => {
          return pick(dataSelectItem, [
            'product_id',
            'product_code',
            'product_name',
            'category_name',
            'manufacture_name',
            'vat_value',
            'unit_name',
            'is_active',
            'purchase_order_detail_id',
            'purchase_order_id',
            'quantity',
            'cost_price',
            'total_price',
            'expected_date',
          ])
        });

        methods.setValue('product_list', list);
      }}
      fieldCheck='product_id'
      defaultDataSelect={methods.watch('product_list')}
      hiddenDeleteClick
    />
  );
}

export default SelectProductModalTable;
