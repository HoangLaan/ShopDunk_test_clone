import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import pick from 'lodash/pick';

function SelectProductModalTable({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onClose,
}) {
  const methods = useFormContext();
  const columns = useMemo(
    () => [
      {
        header: 'Mã sản phẩm',
        accessor: 'product_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên sản phẩm',
        accessor: 'product_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Giá sản phẩm',
        accessor: 'price',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngành hàng',
        accessor: 'category_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Hãng',
        accessor: 'manufacture_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
        classNameHeader: 'bw_text_center',
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

        const list = dataSelect?.map((item, idx) =>
          pick(item, [
            'product_id',
            'product_code',
            'product_name',
            'price',
            'category_name',
            'unit_name',
            'is_active',
            'purchase_requisition_detail_id',
            'quantity',
          ]),
        );

        methods.setValue('product_list', list);
      }}
      fieldCheck='product_id'
      defaultDataSelect={methods.watch('product_list')}
      hiddenDeleteClick
    />
  );
}

export default SelectProductModalTable;
