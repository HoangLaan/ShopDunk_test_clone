import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';

function SelectMemberModalTable({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  customerType,
}) {
  const methods = useFormContext();
  const columns = useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_code',
      },
      {
        header: 'Tên sản phẩm',
        classNameHeader: 'bw_text_center',
        accessor: 'product_name',
      },
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'category_name',
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(dataSelect) => {
        const list = dataSelect?.map((e, idx) => {
          return {
            product_code: e?.product_code,
            product_id: e?.product_id,
            product_name: e?.product_name,
          };
        });
        methods.setValue('selected_product', list);
      }}
      fieldCheck={'product_id'}
      defaultDataSelect={methods.watch('selected_product')}
      hiddenDeleteClick
    />
  );
}

export default SelectMemberModalTable;
