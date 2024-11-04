import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteWorkScheduleType } from 'services/work-schedule-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFieldArray, useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';

const WSTReasonTable = ({ loading, data, disabled, onClickAddNew, onRemove }) => {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: '',
        classNameBody: '',
        formatter: (d, index) => index + 1,
      },
      {
        header: 'Tên lý do đăng kí',
        classNameHeader: 'bw_center bw_text_center',
        classNameBody: 'bw_center',
        formatter: (d, index) => {
          return (
            <FormItem isRequired={true} disabled={disabled}>
              <FormInput
                field={`reasons.${index}.name`}
                validation={{
                  required: 'Tên lý do không được trống',
                }}
              />
            </FormItem>
          );
        },
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_center bw_text_center',
        classNameBody: 'bw_center',
        formatter: (d, index) => {
          return (
            <FormItem disabled={disabled}>
              <FormTextArea field={`reasons.${index}.description`} />
            </FormItem>
          );
        },
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới lý do',
        onClick: () => {
          onClickAddNew();
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_TASKWORKFLOW_DEL',
        onClick: (d, index) => {
          onRemove(index);
        },
      },
    ];
  }, [disabled]);

  return (
    <DataTable actions={actions} noSelect={true} noPaging={true} loading={loading} columns={columns} data={data} />
  );
};

export default WSTReasonTable;
