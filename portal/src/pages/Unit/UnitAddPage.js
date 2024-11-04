import React, { useMemo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import { create, update, getDetail } from 'services/unit.service';
import { useLocation, useParams } from 'react-router-dom';
//components
import { UnitInfo, UnitStatus } from './components/UnitAdd';
const UnitAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { id: unit_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (unit_id) {
        await update(unit_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
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

  const loadUnitDetail = useCallback(() => {
    if (unit_id) {
      getDetail(unit_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [unit_id]);

  useEffect(loadUnitDetail, [loadUnitDetail]);

  const detailForm = [
    {
      title: 'Thông tin đơn vị tính',
      id: 'information',
      component: UnitInfo,
      fieldActive: ['unit_name'],
    },
    { id: 'status', title: 'Trạng thái', component: UnitStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default UnitAddPage;
