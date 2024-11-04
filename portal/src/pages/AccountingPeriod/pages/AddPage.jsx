import React, { useCallback, useEffect, useMemo } from 'react';
import FormSection from 'components/shared/FormSection/index';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { create, update, getById } from 'services/accounting-period.service';
import AccountingPeriodInfo from '../components/FormSection/AccountingPeriodInfo';
import Status from '../components/FormSection/Status';
import { showToast } from 'utils/helpers';

const AccountingPeriodAdd = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_system: 0,
    },
  });

  const { pathname } = useLocation();
  const { id: accounting_period_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);

  const onSubmit = async (payload) => {
    try {
      let label;
      if (accounting_period_id) {
        await update(payload);
        label = 'Chỉnh sửa';
      } else {
        await create(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
          is_system: 0,
        });
      }
      showToast.success(`${label} thành công !`);
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  };

  const loadDetail = useCallback(() => {
    if (accounting_period_id) {
      getById(accounting_period_id).then((value) => {
        methods.reset(value);
      });
    } else {
      methods.reset({
        is_active: 1,
        is_system: 0,
      });
    }
  }, [accounting_period_id, methods]);

  const detailForm = [
    {
      title: 'Thông tin kỳ kế toán',
      id: 'information_order_type',
      component: AccountingPeriodInfo,
      fieldActive: ['accounting_period_name', 'company_id', 'apply_from_date', 'apply_to_date'],
    },
    {
      id: 'status',
      title: 'Trạng thái',
      fieldActive: ['is_active', 'is_system'],
      component: Status,
    },
  ];

  useEffect(loadDetail, [loadDetail]);

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
    </FormProvider>
  );
};

export default AccountingPeriodAdd;
