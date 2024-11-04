import React, {useMemo} from 'react';
import {useFormContext} from 'react-hook-form';

import DataTable from 'components/shared/DataTable/index';

function SelectMemberModalTable({
data,
totalPages,
itemsPerPage,
page,
totalItems,
onChangePage,
onRefresh,
customerType,
}) {
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
        accessor: 'full_name',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value) => (value.gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        header: 'SĐT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        accessor: 'email',
      },
      {
        header: 'Ngày sinh',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'birthday',
      },
      {
        header: 'Trạng thái khách hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'crm_state',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [];
  }, []);

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(dataSelect) => {
        const list = dataSelect?.map(
          (e, idx) => {
            return {
              member_id: e?.member_id,
              data_leads_id: e?.data_leads_id,
              customer_code: e?.customer_code,
              full_name: e?.full_name,
              phone_number: e?.phone_number,
              email: e?.email
            }
          }
        );
        methods.setValue('list_shift_customer', list);
      }}
      fieldCheck={customerType === 1 ? 'member_id' : 'data_leads_id'}
      defaultDataSelect={methods.watch('list_shift_customer')}
      hiddenDeleteClick
    />
  );
}

export default SelectMemberModalTable;
