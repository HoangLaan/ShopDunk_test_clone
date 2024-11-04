import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import PaymentFormInformation from './components/add/PaymentFormInformation';
import { createPaymentForm, getDetailPaymentForm, updatePaymentForm } from 'services/payment-form.service';

const PaymentFormAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { payment_form_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      let label;
      if (payment_form_id) {
        await updatePaymentForm(payload);
        label = 'Chỉnh sửa';
      } else {
        await createPaymentForm(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentForm = useCallback(() => {
    if (payment_form_id) {
      setLoading(true);
      getDetailPaymentForm(payment_form_id)
        .then((value) => {
          methods.reset(value);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_all_store: 0,
        is_all_business: 0,
        is_active: 1,
      });
    }
  }, [payment_form_id, methods]);

  useEffect(loadPaymentForm, [loadPaymentForm]);

  const detailForm = [
    {
      title: 'Thông tin hình thức thanh toán',
      id: 'information',
      component: PaymentFormInformation,
      fieldActive: ['payment_form_code', 'payment_form_name', 'company_id', 'payment_type', 'description'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default PaymentFormAddPage;
