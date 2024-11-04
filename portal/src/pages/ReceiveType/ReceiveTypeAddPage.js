import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import { createReceiveType, getDetailReceiveType, updateReceiveType } from 'services/receive-type.service';
import ReceiveTypeInformation from './components/add/ReceiveTypeInformation';
import FormStatus from '../../components/shared/FormCommon/FormStatus';
import BankAccountTable from './components/add/BankAccountTable';

const ReceiveTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { receive_type_id } = useParams();
  let disabled = useMemo(() => pathname.includes('/view'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.business_id_list = (payload?.business_id_list ?? [])?.map((e) => e.value ?? e);

      payload.bank_account_business_ids = (payload?.bank_account_list ?? []).map((item) => item.bank_account_business_id);

      let label;
      if (receive_type_id) {
        await updateReceiveType(receive_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createReceiveType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      let err = 'Có lỗi xảy ra!';
      if(error?.message) {
        err = error?.message;
      }
      showToast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin nhà cung cấp',
      id: 'information',
      component: ReceiveTypeInformation,
      fieldActive: ['receive_type_code', 'receive_type_name', 'company_id', 'business_id_list'],
      disabled,
    },
    {
      title: 'Thông tin tài khoản ngân hàng',
      id: 'bankAccount',
      component: BankAccountTable,
      
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  const loadReceiveType = useCallback(() => {
    if (receive_type_id) {
      setLoading(true);
      getDetailReceiveType(receive_type_id)
        .then((value) => {
          methods.reset({
            ...value,
          });
          if (value?.is_system) {
            methods.setValue('disabled', true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [receive_type_id, methods]);
  useEffect(loadReceiveType, [loadReceiveType]);

  return (
    <FormProvider {...methods}>
      <FormSection
        loading={loading}
        disabled={disabled || methods.watch('disabled')}
        detailForm={detailForm}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};

export default ReceiveTypeAddPage;
