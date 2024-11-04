import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import OriginInformation from './components/add/OriginInformation';
import OriginStatus from './components/add/OriginStatus';
import { useLocation, useParams } from 'react-router-dom';
import { getDetailOrigin, createOrigin, updateOrigin } from 'services/origin.setvice';
const OriginAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { origin_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (origin_id) {
        await updateOrigin(origin_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createOrigin(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra!');
    }
  };

  const loadOriginDetail = useCallback(() => {
    if (origin_id) {
      getDetailOrigin(origin_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [origin_id]);

  useEffect(loadOriginDetail, [loadOriginDetail]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin xuất xứ',
      component: OriginInformation,
      fieldActive: ['origin_name'],
    },
    { id: 'status', title: 'Trạng thái', component: OriginStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default OriginAddPage;
