import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';

import { createBank, getDetailBank, updateBank } from 'services/bank.service';
import FormSection from 'components/shared/FormSection';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import BankInformation from './components/add/BankInformation';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';

const BankAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      representative_gender: 1,
    },
  });
  const { pathname } = useLocation();
  const { bank_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const [isSystem, setIsSystem] = useState(0);
  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;

      let label;
      if (bank_id) {
        if(!user.isAdministrator && isSystem === 1) return showToast.error("Bạn không có quyền chỉnh sửa với dữ liệu hệ thống !")
        await updateBank(payload);
        label = 'Chỉnh sửa';
      } else {
        await createBank(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error.message ?? 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin ngân hàng',
      id: 'information',
      component: BankInformation,
      fieldActive: ['bank_code', 'bank_name'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  const loadData = useCallback(() => {
    if (bank_id) {
      setLoading(true);
      getDetailBank(bank_id)
        .then((value) => {
          methods.reset({
            ...value,
          });
          setIsSystem(value.is_system)
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [bank_id, methods]);
  useEffect(loadData, [loadData]);

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default BankAddPage;
