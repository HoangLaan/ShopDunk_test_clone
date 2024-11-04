import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import TransferShiftTypeInformation from './components/add/TransferShiftTypeInformation';
import {
  createTransferShiftType,
  getDetailTransferShiftType,
  updateTransferShiftType,
} from 'services/transfer-shift-type.service';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import { showToast } from 'utils/helpers';

const TransferShiftTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_auto_review: 0,
      company_id: 1,
    },
  });
  const { pathname } = useLocation();
  const { id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    const label = id ? 'Chỉnh sửa' : 'Thêm mới';
    try {
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.company_id = payload.company_id ?? 1;
      payload.is_another_business = payload.is_another_business ?? 0;
      payload.review_levels = payload.review_levels ?? [];

      if (payload.is_auto_review === 0 && payload.review_levels.length === 0)
        return showToast.error('Mức duyệt là bắt buộc');

      const result = await (id ? updateTransferShiftType(id, payload) : createTransferShiftType(payload));

      if (id === undefined) {
        methods.reset({
          is_active: 1,
        });
      }

      showToast.success(result ?? `${label} thành công`);
    } catch (error) {
      showToast.error(error.mesage ?? `${label} thất bại`);
    }
  };

  const loadTransferShiftType = useCallback(() => {
    if (id) {
      getDetailTransferShiftType(id).then((value) => {
        methods.reset({
          ...value,
          company_id: +value?.company_id
        });
      });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [methods, id]);

  useEffect(loadTransferShiftType, [loadTransferShiftType]);

  const detailForm = [
    {
      title: 'Thông tin loại yêu cầu chuyển ca',
      id: 'information',
      disabled,
      component: TransferShiftTypeInformation,
      fieldActive: ['transfer_shift_type_name'],
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

export default TransferShiftTypeAddPage;
