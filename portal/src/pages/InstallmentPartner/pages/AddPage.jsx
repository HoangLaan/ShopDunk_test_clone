import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { create, update, getById } from 'services/installment-partner.service';
import InstallmenrPartnerInfo from '../components/FormSection/Infomation';
import Documents from '../components/FormSection/Documents';
import RepresentativeInfo from '../components/FormSection/Representative';
import InstallmentStatus from '../components/FormSection/Status';
import ConnectInfo from '../components/FormSection/ConnectInfo';

import { showToast } from 'utils/helpers';
import { DefaultValue } from '../utils/constant';
import InstallmentPeriod from '../components/FormSection/InstallmentPeriod';
import CheckingInfo from '../components/FormSection/CheckingInfo';
import PaymentInfo from '../components/FormSection/PaymentInfo';

const InstallmentPartnerAdd = () => {
  const methods = useForm({
    defaultValues: DefaultValue,
  });

  const { pathname } = useLocation();
  const { id: installment_partner_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let label;
      if (installment_partner_id) {
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
    if (installment_partner_id) {
      getById(installment_partner_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset(DefaultValue);
    }
  }, [installment_partner_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin đối tác',
      id: 'installment_partner_info',
      component: InstallmenrPartnerInfo,
      fieldActive: ['installment_form_name', 'installment_form_code'],
    },
    {
      title: 'Thông tin người liên hệ',
      id: 'installment_partner_contact',
      component: RepresentativeInfo,
      fieldActive: false,
    },
    {
      title: 'Thông tin hợp đồng',
      id: 'installment_partner_contract',
      component: Documents,
      fieldActive: false,
    },
    {
      title: 'Thông tin kết nối kỹ thuật',
      id: 'installment_partner_connect',
      component: ConnectInfo,
      fieldActive: false,
    },
    {
      title: 'Kỳ hạn trả góp',
      id: 'installment_partner_term',
      component: InstallmentPeriod,
      fieldActive: false,
    },
    {
      title: 'Thông tin đối soát',
      id: 'installment_partner_checking',
      component: CheckingInfo,
      fieldActive: false,
      className: 'bw_col_6',
    },
    {
      title: 'Thông tin thanh toán',
      id: 'installment_partner_payment',
      component: PaymentInfo,
      fieldActive: false,
      className: 'bw_col_6',
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

export default InstallmentPartnerAdd;
