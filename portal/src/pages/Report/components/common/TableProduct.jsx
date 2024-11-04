import React, { useEffect, useState } from 'react';
// import DataTable from 'components/shared/DataTable/index';
import DataTableHandle from './HandleTable';

const ProductTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  setParams,
  dataSelect,
  setDataSelect
}) => {
  
  const columns = [
    {
      header: 'Mã hàng',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'product_code',
    },
    {
      header: 'Tên hàng',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'product_name',
    },
  ];

  useEffect(() => {
    setParams((preParams) => ({ ...preParams }));
  }, []);

  return (
    <DataTableHandle
      loading={loading}
      columns={columns}
      data={data}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      setDataSelect={setDataSelect}
      dataSelect={dataSelect}
    />
  );
};

export default ProductTable;
