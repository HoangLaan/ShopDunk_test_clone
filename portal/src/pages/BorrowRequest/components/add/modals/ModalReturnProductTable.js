import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Tooltip } from 'antd';

import DataTable from 'components/shared/DataTable/index';

function ModalReturnProductTable({ data, totalPages, itemsPerPage, page, totalItems, onChangePage }) {
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
        formatter: (p) => (
          <Tooltip title={p?.product_name}>
            {p?.product_name?.length > 43 ? p?.product_name.slice(0, 40) + '...' : p?.product_name}
          </Tooltip>
        ),
      },
      // {
      //   header: 'Ngành hàng',
      //   classNameHeader: 'bw_text_center',
      //   accessor: 'category_name',
      // },
      {
        header: 'Đã mượn',
        classNameHeader: 'bw_text_center',
        accessor: 'borrow_quantity',
        formatter: (v) => v.borrow_quantity || 0,
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Đã trả',
        classNameHeader: 'bw_text_center',
        accessor: 'total_returned',
        formatter: (v) => v.total_returned || 0,
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Tổng tồn',
        classNameHeader: 'bw_text_center',
        accessor: 'total_inventory',
        formatter: (v) => v.total_inventory || 0,
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Hãng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'manufacture_name',
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
        const list = dataSelect?.map((e, idx) => {
          return {
            product_code: e?.product_code,
            product_id: e?.product_id,
            product_name: e?.product_name,
            manufacture_name: e?.manufacture_name,
            quantity_return: e?.borrow_quantity - e?.total_returned,
            total_inventory: e?.total_inventory,
            borrow_quantity: e?.borrow_quantity,
            total_returned: e?.total_returned,
          };
        });
        methods.setValue('list_product_return', list);
      }}
      fieldCheck={'product_code'}
      defaultDataSelect={methods.watch('list_product_return')}
      hiddenDeleteClick
    />
  );
}

export default ModalReturnProductTable;
