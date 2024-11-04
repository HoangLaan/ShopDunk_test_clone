import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { create, getById, update } from 'services/customer-of-task.service';
import FormInfo from '../components/FormSection/FormInfo';
import Status from '../components/FormSection/Status';
import { showToast } from 'utils/helpers';
import { DefaultValue } from '../utils/constant';


const CustomerOfTaskFormAdd = () => {
  const methods = useForm({
    defaultValues: DefaultValue,
  });

  const { pathname } = useLocation();
  const { id: task_detail_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let label;
      payload.member_id =
        (payload.member_id !== null ? +payload.member_id : undefined) ||
        (payload?.customer?.member_id !== null ? +payload?.customer?.member_id : undefined);
      payload.dataleads_id = 
        (payload.dataleads_id !== null ? +payload.dataleads_id : undefined) ||
        (payload?.customer?.dataleads_id !== null ? +payload?.customer?.dataleads_id : undefined);
      if (task_detail_id) {
        const { store_id, source_id, task_work_flow_id, customer, task_id } = payload;
        payload.task_work_flow_id = task_work_flow_id?.value !== undefined ? task_work_flow_id.value : payload.task_work_flow_id !== undefined ? payload.task_work_flow_id : null;
        payload.source_id = source_id?.value !== undefined ? source_id.value : payload.source_id !== undefined ? payload.source_id : null;
        payload.store_id = store_id?.value !== undefined ? store_id.value : payload.store_id !== undefined ? payload.store_id : null;
        payload.task_id = task_id?.value !== undefined ? task_id.value : payload.task_id !== undefined ? payload.task_id : null;
        payload.member_id = customer?.member_id || payload?.member_id;
        payload.dataleads_id = customer?.dataleads_id || payload?.dataleads_id;
        await update({ task_detail_id, ...payload });
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
      }
      methods.reset(DefaultValue);
      showToast.success(`${label} thành công !`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (task_detail_id) {
      getById(task_detail_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset(DefaultValue);
    }
  }, [task_detail_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin khách hàng thuộc công việc',
      id: 'information',
      component: FormInfo,
      fieldActive: ['customer_id', 'source_id', 'task_work_flow_id'],
    },
    {
      title: 'Trạng thái',
      id: 'status',
      fieldActive: methods.watch('is_active') ? ['is_active'] : [],
      component: Status,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default CustomerOfTaskFormAdd;
