import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import { showToast } from 'utils/helpers';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import PageProvider from '../components/PageProvider/PageProvider';
import BankUserInformation from '../components/Sections/BankUserInformation';
import BankUserService from 'services/bank-user.service';
import usePageInformation from 'hooks/usePageInformation';

function BankUserAdd() {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  console.log(methods.watch());

  const { id: bankUserId, disabled } = usePageInformation();

  const initData = async () => {
    try {
      setLoading(true);
      if (bankUserId) {
        const data = await BankUserService.getById(bankUserId);
        methods.reset(data);
      } else {
        methods.reset({ is_active: STATUS_TYPES.ACTIVE });
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.receiver_list = (payload.receiver_list || []).map((x) => x.user_id);
      if (bankUserId) {
        await BankUserService.update(bankUserId, payload);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await BankUserService.create(payload);
        showToast.success('Thêm mới thành công');
        await initData();
      }
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Tài khoản ngân hàng',
      component: BankUserInformation,
      fieldActive: [
        // 'company_id',
        'bank_number',
        'bank_id',
        'bank_username',
        'province_id',
        'bank_branch',
        'branch_address',
        'description',
      ],
    },
    {
      title: 'Trạng thái',
      component: FormStatus,
      fieldActive: methods.watch('is_active') ? ['is_active'] : ['FALSE'],
      hiddenSystem: false,
    },
  ];

  return (
    <PageProvider>
      <FormProvider {...methods}>
        <FormSection loading={loading} detailForm={detailForm} onSubmit={onSubmit} disabled={disabled} />
      </FormProvider>
    </PageProvider>
  );
}

export default BankUserAdd;
