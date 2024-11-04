import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { SkillLevelInfo, SkillLevelStatus } from './components/SkillLevelForm';
import { createSkillLevel, getDetail, updateSkillLevel } from './helpers/call-api';
const SkillLevelAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: level_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      //payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (level_id) {
        await updateSkillLevel(level_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createSkillLevel(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error ? error.message : 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (level_id) {
      getDetail(level_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [level_id]);

  const detailForm = [
    {
      title: 'Thông tin trình độ kỹ năng',
      id: 'information',
      component: SkillLevelInfo,
      fieldActive: ['level_name'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: SkillLevelStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default SkillLevelAdd;
