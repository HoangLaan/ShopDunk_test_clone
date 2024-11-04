import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteTransferShiftType } from 'services/transfer-shift-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFieldArray, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import { FormProvider, useFormContext } from 'react-hook-form';

const RLMDepartmentTable = ({ loading, data, disabled, isValidate }) => {
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
                required: !isValidate ? 'Vị trí là bắt buộc' : false,
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
        permission: 'HR_TRANSFERSHIFT_TYPE_DEL',
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
