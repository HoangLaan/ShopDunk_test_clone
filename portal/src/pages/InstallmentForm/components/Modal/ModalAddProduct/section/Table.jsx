import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import { mergeArrayData } from 'pages/InstallmentForm/utils/helper';

const CustomerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading, closeModal }) => {
  const methods = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'Mã hàng hóa',
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
        header: 'Kích hoạt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => {
          return <span>{item.is_active ? 'Có' : 'Không'}</span>;
        },
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
      showBulkButton
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
    />
  );
};

export default CustomerTable;
