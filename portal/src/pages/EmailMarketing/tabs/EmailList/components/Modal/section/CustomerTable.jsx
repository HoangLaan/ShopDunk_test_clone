import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';
import { showToast } from 'utils/helpers';

const CustomerTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading, closeModal }) => {
  const methods = useFormContext();

  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'customer_code',
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'customer_email',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'customer_phone',
      },
    ],
    [],
  );

  const handleBulkAction = (dataSelect = []) => {
    if (dataSelect.some((data) => !data.customer_email)) {
      showToast.warning('Khách hàng không có email sẽ không được thêm vào danh sách');
    }

    const selectedCustomers = dataSelect
      ?.filter((_) => _.customer_email)
      .map((customer) => ({
        customer_id: customer.customer_id,
        customer_code: customer.customer_code,
        customer_name: customer.customer_name,
        customer_email: customer.customer_email,
        customer_phone: customer.customer_phone,
      }));

    const previousCustomers = methods.getValues('customer_list') || [];

    const mergedCustomers = previousCustomers.concat(selectedCustomers).filter((item, index, self) => {
      return index === self.findIndex((t) => t.customer_id === item.customer_id);
    });

    methods.setValue('customer_list', mergedCustomers);

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
