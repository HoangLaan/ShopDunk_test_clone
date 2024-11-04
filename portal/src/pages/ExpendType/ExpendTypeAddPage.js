import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { showToast } from 'utils/helpers';
import { useLocation, useParams } from 'react-router-dom';

import FormSection from 'components/shared/FormSection';
import { createExpendType, getDetailExpendType, updateExpendType } from 'services/expend-type.service';
import ExpendTypeInformation from './components/add/ExpendTypeInformation';
import FormStatus from '../../components/shared/FormCommon/FormStatus';
import ReviewLevelUserTable from './components/add/ReviewLevelUserTable';
import BankAccountTable from './components/add/BankAccountTable';

const ExpendTypeAddPage = () => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const { pathname } = useLocation();
  const { expend_type_id } = useParams();
  const disabled = useMemo(() => pathname.includes('/view'), [pathname]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      payload.is_active = payload.is_active ? 1 : 0;
      payload.is_system = payload.is_system ? 1 : 0;
      payload.business_id_list = (payload?.business_id_list ?? [])?.map((e) => e.value ?? e);
      payload.review_level_user_list = (payload?.review_level_user_list ?? []).map((review_level_user) => {
        if (review_level_user.is_auto_review) {
          review_level_user.user_review_list = undefined;
        } else {
          review_level_user.user_review_list = (review_level_user.user_review_list ?? []).map(
            (user_review) => user_review.value ?? user_review,
          );
        }
        return review_level_user;
      });

      payload.bank_account_business_ids = payload.bank_account_list?.map((item) => item.bank_account_business_id);

      let label;
      if (expend_type_id) {
        await updateExpendType(expend_type_id, payload);
        label = 'Chỉnh sửa';
      } else {
        await createExpendType(payload);
        label = 'Thêm mới';
        methods.reset({
          is_active: 1,
        });
      }
      showToast.success(`${label} thành công!!!`);
    } catch (error) {
      showToast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const detailForm = [
    {
      title: 'Thông tin nhà cung cấp',
      id: 'information',
      component: ExpendTypeInformation,
      fieldActive: ['expend_type_code', 'expend_type_name', 'company_id', 'business_id_list'],
    },
    {
      title: 'Thông tin tài khoản ngân hàng',
      id: 'bankAccount',
      component: BankAccountTable,
    },
    {
      title: 'Thông tin mức duyệt',
      id: 'reviewLevel',
      component: ReviewLevelUserTable,
    },
    { id: 'status', title: 'Trạng thái', component: FormStatus },
  ];

  const loadExppendType = useCallback(() => {
    if (expend_type_id) {
      setLoading(true);
      getDetailExpendType(expend_type_id)
        .then((value) => {
          methods.reset({
            ...value,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      methods.reset({
        is_active: 1,
      });
    }
  }, [expend_type_id]);
  useEffect(loadExppendType, [loadExppendType]);

  return (
    <FormProvider {...methods}>
      <FormSection loading={loading} disabled={disabled} detailForm={detailForm} onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ExpendTypeAddPage;
