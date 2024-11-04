import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { showToast } from 'utils/helpers';

import { VatInfo, VatStatus } from './components/VATForm';
import { createVAT, getDetail, updateVAT } from './helpers/call-api';
const VATAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });

  const { pathname } = useLocation();
  const { id: vat_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (vat_id) {
        payload.vat_id = parseInt(vat_id);
        await updateVAT(payload);
        label = 'Chỉnh sửa';
      } else {
        await createVAT(payload);
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
    if (vat_id) {
      getDetail(vat_id).then((value) => {
        methods.reset({
          ...value,
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [vat_id]);

  const detailForm = [
    {
      title: 'Thông tin',
      id: 'information',
      component: VatInfo,
      fieldActive: ['vat_name'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      component: VatStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default VATAdd;
