import React, { useEffect } from 'react';
import DataTable from 'components/shared/DataTable/index';
import DataTableHandle from './HandleTable';

const CustomerTable = ({
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
      header: 'Mã khách hàng',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'code',
    },
    {
      header: 'Tên khách hàng',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'full_name',
    },
    {
      header: 'Địa chỉ',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'address',
    },
    {
      header: 'Mã số thuế',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'tax_code',
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

export default CustomerTable;
