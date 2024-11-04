import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSection from 'components/shared/FormSection/index';
import { STATUS_TYPES } from 'utils/constants';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import BudgetTypeInfo from './components/Section/BudgetTypeInfo';
import BudgetStatus from './components/Section/BudgetStatus';
import BudgetTypeReview from './components/Section/BudgetTypeReview';
import { createBudgetType, getDetailBudgetType, updateBudgetType } from '../../services/budget-type.service';

function BudgetTypeAdd({ id = null, disabled = false }) {
  const methods = useForm();
  const { reset, handleSubmit } = methods;

  const [loading, setLoading] = useState(false);

  const initData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getDetailBudgetType(id);
        reset(data);
      } else {
        reset({
          is_active: STATUS_TYPES.ACTIVE,
          is_system: STATUS_TYPES.HIDDEN,
          is_auto_review: false,
        });
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

  const onSubmit = async (dataSubmit) => {
    const body = { ...dataSubmit, review_users: [] };
    try {
      setLoading(true);
      if (id) {
        await updateBudgetType(id, body);
        showToast.success('Chỉnh sửa thành công');
      } else {
        await createBudgetType(body);
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
      title: 'Thông tin loại ngân sách',
      component: BudgetTypeInfo,
      fieldActive: ['company_id', 'business_id', 'effective_time', 'budget_type_name', 'budget_type_code'],
    },
    {
      title: 'Thông tin mức duyệt',
      component: BudgetTypeReview,
      fieldActive: null,
    },
    {
      title: 'Trạng thái',
      component: BudgetStatus,
      fieldActive: ['is_active', 'is_system'],
    },
  ];

  const actions = [
    {
      globalAction: true,
      icon: ICON_COMMON.save,
      type: 'success',
      submit: true,
      content: disabled ? 'Chỉnh sửa' : id ? 'Hoàn tất chỉnh sửa' : 'Hoàn tất thêm mới',
      onClick: () => {
        if (disabled) window._$g.rdr('/budget-type/edit/' + id);
        else handleSubmit(onSubmit);
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection
        loading={loading}
        detailForm={detailForm}
        onSubmit={onSubmit}
        disabled={disabled}
        actions={actions}
      />
    </FormProvider>
  );
}

export default BudgetTypeAdd;
