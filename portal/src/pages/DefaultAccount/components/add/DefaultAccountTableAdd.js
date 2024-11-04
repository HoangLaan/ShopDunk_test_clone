import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

const DefaultAccountTableAdd = ({ loading, data, disabled }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Tên cột',
        accessor: 'col_name',
        classNameHeader: 'bw_text_center',
        classNameBody: '',
      },
      {
        header: 'Lọc tài khoản',
        accessor: 'default_account_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (d, index) => {
          if (d?.type)
            return (
              <FormSelect
                disabled={disabled}
                placeholder='Chọn tài khoản'
                mode={'multiple'}
                field={`default_account_list.${index}.${d.type}_ids`}
                list={d.account_options}
              />
            );
        },
      },
      {
        header: 'Tài khoản ngầm định',
        accessor: 'description',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (d, index) => {
          if (d.type) {
            return (
              <FormSelect
                disabled={disabled}
                allowClear={true}
                placeholder='Chọn tài khoản'
                field={`default_account_list.${index}.${d.type}_id_main`}
                list={d.account_options}
              />
            );
          }
        },
      },
    ],
    [disabled],
  );

  return <DataTable noSelect={true} noPaging={true} loading={loading} columns={columns} data={data} />;
};

export default DefaultAccountTableAdd;
