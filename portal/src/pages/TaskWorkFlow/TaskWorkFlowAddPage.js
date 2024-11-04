import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import TaskWorkflowInformation from './components/add/TaskWorkFlowInformation';
import { createTaskWorkflow, getDetailTaskWorkflow, updateTaskWorkflow } from 'services/task-work-flow.service';
import FormStatus from 'components/shared/FormCommon/FormStatus';

const initForm = {
  is_active: 1,
  color: '#1677FF',
};

const TaskWorkFlowAddPage = () => {
  const methods = useForm({
    defaultValues: initForm,
  });
  const { pathname } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const disabledEdit = useMemo(() => pathname.includes('/edit'), [pathname]);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (id) {
        await updateTaskWorkflow(id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createTaskWorkflow(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadTaskWorkflow = useCallback(() => {
    if (id) {
      getDetailTaskWorkflow(id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset(initForm);
    }
  }, [methods, id]);

  useEffect(loadTaskWorkflow, [loadTaskWorkflow]);

  const detailForm = [
    {
      title: 'Thông tin bước xử lý công việc',
      id: 'information',
      disabledEdit: disabledEdit,
      component: TaskWorkflowInformation,
      fieldActive: ['work_flow_name', 'work_flow_code', 'color'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default TaskWorkFlowAddPage;
