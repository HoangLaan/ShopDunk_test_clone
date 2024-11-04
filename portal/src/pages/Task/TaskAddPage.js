import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import { createTask, getTaskDetail, updateTask } from 'services/task.service';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import TaskInformation from './components/add/TaskInformation';
import AssignmentInformation from './components/add/AssignmentInformation';
import MemberInformationTable from './components/add/MemberInformationTable';
import useDeepMemo from 'hooks/useDeepMemo';

const TaskAddPage = ({ location: { state: locationState } }) => {
  const initMemberList = useDeepMemo(() => locationState?.selectedCustomer || [], [locationState]);

  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { task_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);

      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      payload.supervisor_user = String(payload.supervisor_user?.value);

      payload.staff_user = String(payload.staff_user?.value);

      let label;
      if (task_id) {
        await updateTask(payload);
        label = 'Chỉnh sửa';
      } else {
        await createTask(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadData = useCallback(() => {
    if (task_id) {
      setLoading(true);
      getTaskDetail(task_id)
        .then((value) => {
          methods.reset({
            ...value,
            company_id: parseInt(value?.company_id),
            department_id: parseInt(value?.department_id),
            store_id: parseInt(value?.store_id),
            parent_id: value?.parent_id ? parseInt(value?.parent_id) : null,
            supervisor_user: {
              value: value?.supervisor_user,
              label: value?.supervisor_name,
            },
            staff_user: {
              value: value?.staff_user,
              label: value?.staff_name,
            },
          });
        })
        .catch((error) => {
          showToast.error(error?.message ?? 'Có lỗi xảy ra', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        member_list: initMemberList,
        is_active: 1,
      });
    }
  }, [task_id, methods, initMemberList]);

  useEffect(loadData, [loadData]);

  const detailForm = [
    {
      title: 'Thông tin công việc',
      id: 'information',
      component: TaskInformation,
      fieldActive: ['task_type_id', 'start_date', 'end_date', 'task_name'],
    },
    {
      title: 'Thông tin phân công',
      id: 'assignment',
      component: AssignmentInformation,
      fieldActive: ['company_id', 'department_id', 'supervisor_user', 'staff_user'],
    },
    {
      title: 'Thông tin khách hàng',
      id: 'memberInformation',
      component: MemberInformationTable,
      fieldActive: ['member_list'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default TaskAddPage;