import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { create, getById, update } from 'services/installment-form.service';
import InstallmentFormInfo from '../components/FormSection/InstallmenrFormInfo';
import InstallmentApply from '../components/FormSection/InstallmentApply';
import PartnerInfo from '../components/FormSection/PartnerInfo';
import InstallmentStatus from '../components/FormSection/Status';
import { showToast } from 'utils/helpers';
import { DefaultValue } from '../utils/constant';
import { handleRadioValue } from '../utils/helper';

const InstallmentFormAdd = () => {
  const methods = useForm({
    defaultValues: DefaultValue,
  });

  const { pathname } = useLocation();
  const { id: installment_form_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    handleRadioValue(payload);
    try {
      let label;
      if (installment_form_id) {
        await update(payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset(DefaultValue);
      }
      showToast.success(`${label} thành công !`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (installment_form_id) {
      getById(installment_form_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset(DefaultValue);
    }
  }, [installment_form_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin hình thức trả góp',
      id: 'installment_form_info',
      component: InstallmentFormInfo,
      fieldActive: ['installment_form_name'],
    },
    {
      title: 'Thông tin đối tác',
      id: 'installment_form_info',
      component: PartnerInfo,
      fieldActive: ['pay_partner_id', 'installment_period'],
    },
    {
      title: 'Áp dụng trả góp',
      id: 'installment_form_info',
      component: InstallmentApply,
      fieldActive: false,
    },
    {
      id: 'installment_form_status',
      title: 'Trạng thái',
      fieldActive: ['is_active', 'is_system'],
      component: InstallmentStatus,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default InstallmentFormAdd;
