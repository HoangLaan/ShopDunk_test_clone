import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection';
import { useLocation, useParams } from 'react-router-dom';
import AccountingAccountInformation from './components/add/AccountingAccountInformation';
import FormStatus from 'components/shared/FormCommon/FormStatus';
import {
  createAccountingAccount,
  getDetailAccountingAccount,
  updateAccountingAccount,
} from 'services/accounting-account.service';
import { showToast } from 'utils/helpers';
import { useAuth } from 'context/AuthProvider';

const AccountingAccountAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
      is_option: 0,
    },
  });
  const { pathname } = useLocation();
  const { accounting_account_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isCopy = useMemo(() => pathname.includes('/copy'), [pathname]);
  const {user} = useAuth();
  const [isSystem, setIsSystem] = useState(0);
  const onSubmit = async (payload) => {
    try {
      let value = {
        ...payload,
        is_active: payload.is_active ? 1 : 0,
        is_system: payload.is_system ? 1 : 0,
      };
      let label;
      if (accounting_account_id) {
        if (isCopy) {
          value.accounting_account_id = null;
          await createAccountingAccount(value);
          label = 'Sao chép';
        } else {
          if(!user.isAdministrator && isSystem === 1) return showToast.error("Bạn không có quyền chỉnh sửa với dữ liệu hệ thống !")
          await updateAccountingAccount(accounting_account_id, value);
          label = 'Chỉnh sửa';
        }
      } else {
        await createAccountingAccount(value);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công`);
    } catch (error) {
      showToast.error(error?.message ?? 'Có lỗi xảy ra');
    }
  };

  const loadAccoutingAccount = useCallback(() => {
    if (accounting_account_id) {
      getDetailAccountingAccount(accounting_account_id).then((value) => {
        methods.reset({ ...value, company_id: +value.company_id, property: +value.property });
        setIsSystem(value.is_system)
      });
    } else {
      methods.reset({
        is_active: 1,
        is_option: 0,
      });
    }
  }, [accounting_account_id]);

  useEffect(loadAccoutingAccount, [loadAccoutingAccount]);

  const detailForm = [
    {
      title: 'Thông tin tài khoản',
      id: 'information',
      component: AccountingAccountInformation,
      fieldActive: ['accounting_account_name', 'property', 'accounting_account_code', 'company_id'],
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];
  const actions = [
    {
      icon: 'fi fi-rr-copy',
      submit: true,
      content: 'Sao chép',
      className: 'bw_btn bw_btn_success',
    },
  ];
  return (
    <FormProvider {...methods}>
      <FormSection actions={isCopy ? actions : null} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default AccountingAccountAddPage;
