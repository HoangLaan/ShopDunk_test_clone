import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import { mergeArrayData } from 'pages/InstallmentForm/utils/helper';

const CustomerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading, closeModal }) => {
  const methods = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'Ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'category_name',
      },
      {
        header: 'Thuộc ngành hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'parent_name',
      },
    ],
    [],
  );

  const handleBulkAction = (dataSelect = []) => {
    const currentCategoryList = methods.getValues('category_list') || [];
    methods.setValue('category_list', mergeArrayData(currentCategoryList, dataSelect, 'category_id'));
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
