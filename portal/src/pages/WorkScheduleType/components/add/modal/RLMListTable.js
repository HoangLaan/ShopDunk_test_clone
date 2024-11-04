import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteWorkScheduleType } from 'services/work-schedule-type.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useFieldArray, useFormContext } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';

const RLMListTable = ({ loading, data, onRefresh, disabled }) => {
  const { control } = useFormContext();
  const dispatch = useDispatch();
  const { fields } = useFieldArray({
    control,
    name: 'default_account_list',
  });
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
        accessor: 'default_account_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
    ],
    [disabled],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_TASKWORKFLOW_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                // await deleteTaskWorkflow([_?.task_work_flow_id]);
                // onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return <DataTable actions={actions} noSelect={true} noPaging={true} columns={columns} data={data} />;
};

export default RLMListTable;
