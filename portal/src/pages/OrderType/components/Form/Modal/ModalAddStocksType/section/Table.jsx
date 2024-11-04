import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import { mergeArrayData } from 'pages/InstallmentForm/utils/helper';

const CustomerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading, closeModal }) => {
  const methods = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'Mã loại kho',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_type_code',
      },
      {
        header: 'Tên loại kho',
        classNameHeader: 'bw_text_center',
        accessor: 'stocks_type_name',
      },
    ],
    [],
  );

  const handleBulkAction = (dataSelect = []) => {
    const currentCategoryList = methods.getValues('stocks_type_list') || [];
    methods.setValue('stocks_type_list', mergeArrayData(currentCategoryList, dataSelect, 'stocks_type_id'));
    closeModal();
  };

  return (
    <DataTable
      hiddenDeleteClick
      showBulkButton
      fieldCheck='stocks_type_id'
      defaultDataSelect={methods.watch('stocks_type_list')}
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
