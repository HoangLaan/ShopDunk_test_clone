import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { SkillGroupInfo, SkillGroupStatus } from './components/SkillGroupForm';
import { createSkillGroup, getDetail, updateSkillGroup } from './helpers/call-api';

const SkillGroupAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { id: skillgroup_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      //payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (skillgroup_id) {
        await updateSkillGroup(skillgroup_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createSkillGroup(payload);
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
    if (skillgroup_id) {
      getDetail(skillgroup_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [skillgroup_id]);

  const detailForm = [
    {
      title: 'Thông tin nhóm kỹ năng',
      id: 'information',
      component: SkillGroupInfo,
      fieldActive: ['skillgroup_name'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: SkillGroupStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default SkillGroupAdd;
