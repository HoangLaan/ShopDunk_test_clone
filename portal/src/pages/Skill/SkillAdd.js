import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { SkillInfo, SkillStatus } from './components/SkillForm';
import { createSkill, getDetail, updateSkill } from './helpers/call-api';

const SkillAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { id: skill_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      let label;
      if (skill_id) {
        await updateSkill(skill_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createSkill(payload);
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
    if (skill_id) {
      getDetail(skill_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [skill_id]);

  const detailForm = [
    {
      title: 'Thông tin kỹ năng',
      id: 'information',
      component: SkillInfo,
      fieldActive: ['skill_name', 'skill_group_list'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: SkillStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default SkillAdd;
