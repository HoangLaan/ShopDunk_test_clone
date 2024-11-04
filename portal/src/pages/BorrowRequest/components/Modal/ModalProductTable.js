import React, {useMemo} from 'react';
import {useFormContext} from 'react-hook-form';

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
      {
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'manufacture_name',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [];
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(dataSelect) => {
        const list = dataSelect?.map(
          (e, idx) => {
            return {
              product_code: e?.product_code,
              product_id: e?.product_id,
              product_name: e?.product_name,
              manufacture_name: e?.manufacture_name,
            }
          }
        );
        methods.setValue('list_product_borrow', list);
      }}
      fieldCheck={'product_code'}
      defaultDataSelect={methods.watch('list_product_borrow')}
      hiddenDeleteClick
    />
  );
}

export default SelectMemberModalTable;
