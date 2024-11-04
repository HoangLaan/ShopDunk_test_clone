import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';
import { createDegree, getDetail, updateDegree } from './helpers/call-api';
import { DegreeInfo, DegreeStatus } from './components/DegreeForm';

const DegreeAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: degree_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  console.log(disabled);
  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      let label;
      if (degree_id) {
        await updateDegree(degree_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createDegree(payload);
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
    if (degree_id) {
      getDetail(degree_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [degree_id]);

  const detailForm = [
    {
      title: 'Thông tin kỹ năng',
      id: 'information',
      component: DegreeInfo,
      fieldActive: ['degree_name'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: DegreeStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default DegreeAdd;
