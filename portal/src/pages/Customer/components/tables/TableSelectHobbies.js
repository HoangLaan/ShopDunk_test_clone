/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import DataTable from 'components/shared/DataTable/index';
import HobbiesService from 'services/hobbies.service';
import { useCustomerContext } from 'pages/Customer/utils/context';

const TableSelectHobbies = () => {
  const { setCustomerState, hobbiesRelativesMethods } = useCustomerContext()

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
    HobbiesService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    loadData();
    setCustomerState(prev => ({ ...prev, refreshModalHobbies: loadData }))
  }, [loadData]);

  const columns = useMemo(() => {
    return [
      {
        header: 'Tên sở thích',
        accessor: 'hobbies_name',
      },
      {
        header: 'Áp dụng thuộc tính sản phẩm',
        formatter: (_, idx) => _.is_apply_attribute ? 'Có' : 'Không',
      },
      {
        header: 'Thuộc tính sản phẩm',
        accessor: 'product_attribute_name_list',
      },
      {
        header: 'Giá trị',
        accessor: 'hobbies_value_list',
      },
    ];
  }, []);

  return (
    <div className='table_select_hobbies'>
      <DataTable
        hiddenActionRow={true}
        hiddenDeleteClick={true}
        fieldCheck='hobbies_id'
        defaultDataSelect={hobbiesRelativesMethods.watch('customer_hobbies')}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={(page) => onChange({ page })}
        handleBulkAction={(values) => {
          hobbiesRelativesMethods.setValue('customer_hobbies', values)
        }}
      />
    </div>
  );
};

export default TableSelectHobbies;
