import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { FormProvider, useFormContext } from 'react-hook-form';

const RLMDepartmentTable = ({ loading, data, disabled }) => {
  const { watch, setValue, remove, resetField } = useFormContext();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Phòng ban duyệt',
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Vị trí duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d, index) => {
          return (
            <FormSelect
              list={d.positionOptions}
              field={`departments.${index}.positions`}
              placeholder='Chọn vị trí'
              mode={'multiple'}
              allowClear={true}
              validation={{
                required: 'Vị trí là bắt buộc',
              }}
              onChange={(value) => {
                 // Chọn tất cả thì clear hết value trước đó
                 if(value.includes(0)){
                  return setValue(`departments.${index}.positions`, [0])
                }
                setValue(`departments.${index}.positions`, value)
              }}
            />
          );
        },
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (data, index) => {
          setValue(
            `departments`,
            watch('departments').filter((_, i) => i !== index),
          );
        },
      },
    ];
  }, []);

  return (
    <>
      <DataTable actions={actions} noSelect={true} noPaging={true} loading={loading} columns={columns} data={data} />
    </>
  );
};

export default RLMDepartmentTable;
