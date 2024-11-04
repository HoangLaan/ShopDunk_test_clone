import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import { mergeArrayData } from 'pages/InstallmentForm/utils/helper';
import { formatPrice } from 'utils';

const CustomerTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  loading,
  closeModal,
  onChangeSelect,
}) => {
  const methods = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Mã đơn mua hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'purchase_order_code',
      },
      {
        header: 'Số tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'total_money',
        formatter: (p) => formatPrice(p.total_money, false, ','),
      },
      {
        header: 'Nhà cung cấp',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'supplier_name',
      },
    ],
    [],
  );

  const handleBulkAction = (dataSelect = []) => {
    const currentCategoryList = methods.getValues('product_list') || [];
    methods.setValue('product_list', mergeArrayData(currentCategoryList, dataSelect, 'product_id'));
    closeModal();
  };

  return (
    <DataTable
      hiddenDeleteClick
      columns={columns}
      data={data}
      actions={[]}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      loading={loading}
      handleBulkAction={handleBulkAction}
      onChangeSelect={onChangeSelect}
    />
  );
};

export default CustomerTable;
