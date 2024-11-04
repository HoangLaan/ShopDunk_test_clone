/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import DataTable from 'components/shared/DataTable/index';
import { useCustomerContext } from 'pages/Customer/utils/context';
import { getListCustomer } from 'services/customer.service';
import { changeKeyInArray } from 'pages/Customer/utils/utils';

const TableSelectHobbies = () => {
  const { hobbiesRelativesMethods } = useCustomerContext()

  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 5,
  });

  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const onChange = (p) => setParams((prev) => ({ ...prev, ...p }));

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    getListCustomer(params)
      .then(data => {
        const dataItems = changeKeyInArray(data.items, 'member_id', 'member_ref_id')
        setDataRows({ ...data, items: dataItems })
      })
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(loadData, [loadData]);

  const columns = useMemo(() => {
    return [
      {
        header: 'Mã khách hàng',
        accessor: 'customer_code',
      },
      {
        header: 'Giới tính',
        formatter: _ => _?.gender? 'Nam': 'Nữ',
      },
      {
        header: 'Họ tên',
        accessor: 'full_name',
      },
      {
        header: 'Ngày sinh',
        accessor: 'birthday',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        accessor: 'email',
      },
    ];
  }, []);

  return (
    <div className='table_select_relatives'>
      <DataTable
        hiddenActionRow={true}
        hiddenDeleteClick={true}
        fieldCheck='member_ref_id'
        defaultDataSelect={hobbiesRelativesMethods.watch('customer_relatives')}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={(page) => onChange({ page })}
        handleBulkAction={(values) => {
          hobbiesRelativesMethods.setValue('customer_relatives', values)
        }}
      />
    </div>
  );
};

export default TableSelectHobbies;
