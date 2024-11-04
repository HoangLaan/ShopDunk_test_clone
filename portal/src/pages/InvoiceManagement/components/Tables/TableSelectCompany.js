import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';

const TableSelectCompany = ({ params, dataRows, onChange }) => {
  const methods = useFormContext();
  const watchCustomerCompany = methods.watch('customer_company');

  const columns = useMemo(() => {
    const startPageIndex = (params.page - 1) * params.itemsPerPage + 1;

    return [
      {
        header: 'STT',
        formatter: (_, idx) => idx + startPageIndex,
      },
      {
        header: 'Tên công ty',
        accessor: 'customer_company_name',
      },
      {
        header: 'Người đại diện',
        accessor: 'representative_name',
      },
      {
        header: 'Mã số thuế',
        accessor: 'tax_code',
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
  }, [params.page, params.itemsPerPage]);

  const onChangeSelect = useCallback((values) => {
    if (values?.length === 1) {
      methods.setValue('customer_company', values[0]);
    } else {
      methods.setValue('customer_company', values[1]);
    }
  }, [])

  return (
    <div className='table_select_company'>
      <DataTable
        key={watchCustomerCompany?.customer_company_id || 0}
        hiddenActionRow={true}
        hiddenDeleteClick={true}
        fieldCheck='customer_company_id'
        defaultDataSelect={watchCustomerCompany? [watchCustomerCompany]: []}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={(page) => onChange({ page })}
        onChangeSelect={onChangeSelect}
      />
    </div>
  );
};

export default TableSelectCompany;
