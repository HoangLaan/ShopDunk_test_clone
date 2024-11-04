import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import WorkScheduleTypeInformation from './components/add/WorkScheduleTypeInformation';
import {
  createWorkScheduleType,
  getDetailWorkScheduleType,
  updateWorkScheduleType,
} from 'services/work-schedule-type.service';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';

const WorkScheduleTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      reasons: [{ name: '', description: '' }],
    },
  });
  const { pathname } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.is_auto_review = payload.is_auto_review ?? 1;
      payload.review_levels = payload.review_levels ?? [];

      if (payload.is_auto_review === 0 && payload.review_levels.length === 0)
        return showToast.error('Phải chọn tự động duyệt hoặc có mức duyệt');

      if (payload.is_auto_review === 1) {
        payload.review_levels = [];
      }
      if (id) {
        await updateWorkScheduleType(id, payload).then((response) => {
          showToast.success(response?.message ?? `Chỉnh sửa thành công`);
        })
      } else {
        await createWorkScheduleType(payload).then((response) => {
          showToast.success(response?.message ?? `Thêm mới thành công`);
          methods.reset({
            is_active: 1,
          });
        })
      }
      // const result = id ? await updateWorkScheduleType(id, payload) : await createWorkScheduleType(payload);

      // if (result?.status !== 200) return showToast.error(result?.message ?? `${id ? 'Chỉnh sửa' : 'Thêm mới'} thất bại`);

      // showToast.success(result?.message ?? `${id ? 'Chỉnh sửa' : 'Thêm mới'} thành công`);
      // if (!id) {
      //   methods.reset({
      //     is_active: 1,
      //   });
      // }
    } catch (error) {
      showToast.error(error.message ?? `${id ? 'Chỉnh sửa' : 'Thêm mới'} thất bại`);
    }
  };

  const loadWorkScheduleType = useCallback(() => {
    if (id) {
      getDetailWorkScheduleType(id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [methods, id]);

  useEffect(loadWorkScheduleType, [loadWorkScheduleType]);

  const detailForm = [
    {
      title: 'Thông tin loại lịch công tác',
      id: 'information',
      disabled,
      component: WorkScheduleTypeInformation,
      fieldActive: ['work_schedule_type_name', 'work_schedule_type_list'],
      isEdit: id ? true : false,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default WorkScheduleTypeAddPage;
