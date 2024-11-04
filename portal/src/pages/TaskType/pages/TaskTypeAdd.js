import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import { showToast } from 'utils/helpers';
import TaskTypeService from 'services/task-type.service';
import TaskTypeInformation from '../components/Sections/TaskTypeInformation';
import TaskTypeTaskWorkflow from '../components/Sections/TaskTypeTaskWorkflow';
import ModalSelectTaskWorkflow from '../components/Modals/ModalSelectTaskWorkflow';
import TaskTypePermission from '../components/Sections/TaskTypePermission';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import PageProvider from '../components/PageProvider/PageProvider';
import CustomerCareTypeInformation from '../components/Sections/CustomerCareTypeInformation';
import { MODAL } from '../utils/constants';
import { getErrorMessage } from '../utils/utils';
import FormReceiver from '../components/Forms/FormReceiver';
import FormDivide from '../components/Forms/FormDivide';
import usePageInformation from 'hooks/usePageInformation';
// import useDetectHookFormChange from 'hooks/useDetectHookFormChange';

function TaskTypeAdd() {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const { id: taskTypeId, disabled } = usePageInformation()

  // console.log('TaskTypeAdd', methods.getValues());
  // useDetectHookFormChange(methods);

  const initData = async () => {
    try {
      setLoading(true);
      if (taskTypeId) {
        const data = await TaskTypeService.getById(taskTypeId);
        methods.reset(data);
      } else {
        methods.reset({ is_active: STATUS_TYPES.ACTIVE });
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.model_list = (payload.model_list || []).map((x) => x.value || x.id);
      payload.task_wflow_list = (payload.task_wflow_list || []).map((x) => {
        let type_purchase = null;
        if (x.type_purchase === 1) {
          type_purchase = 1;
        }
        if (x.is_refuse === 1) {
          type_purchase = 0;
        }
        return { ...x, type_purchase };
      });
      if (taskTypeId) {
        await TaskTypeService.update(taskTypeId, payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await TaskTypeService.create(payload);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      id: 'TASK_TYPE_INFORMATION',
      title: 'Thông tin công việc',
      component: TaskTypeInformation,
      fieldActive: ['type_name', 'description'],
    },
    {
      title: 'Thông tin CSKH',
      component: CustomerCareTypeInformation,
    },
    {
      id: 'FORM_DIVIDE',
      title: 'Phân công chăm sóc',
      component: FormDivide,
      // fieldActive: ['receiver_list'],
    },
    {
      id: 'RECEIVER',
      title: 'Người nhận thông tin CSKH',
      component: FormReceiver,
      fieldActive: ['receiver_list'],
    },
    {
      id: 'TASK_TYPE_PERMISSION',
      title: 'Thông tin quyền',
      component: TaskTypePermission,
      fieldActive: ['add_function_id', 'edit_function_id', 'delete_function_id'],
    },
    {
      id: 'TASK_TYPE_TASK_WORKFLOW',
      title: 'Quy trình xử lý',
      component: TaskTypeTaskWorkflow,
      fieldActive: ['task_wflow_list'],
    },
    {
      title: 'Trạng thái',
      component: FormStatus,
      id: 'FORM_STATUS',
      hiddenSystem: true,
    },
  ];

  return (
    <PageProvider>
      <FormProvider {...methods}>
        <FormSection loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
        <ModalSelectTaskWorkflow />
      </FormProvider>

      <div id={MODAL.USER_CARE}></div>
      <div id={MODAL.CONDITION}></div>
    </PageProvider>
  );
}

export default TaskTypeAdd;
