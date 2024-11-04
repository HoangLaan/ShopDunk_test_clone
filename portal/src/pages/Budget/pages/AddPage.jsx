import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { create, getDetail, update } from 'services/budget.service';
import { showToast } from 'utils/helpers';

import FormSection from 'components/shared/FormSection';
import BudgetInfo from '../components/section/BudgetInfo';
import BudgetStatus from '../components/section/BudgetStatus';
//compnents

const formDefaultValue = { is_active: 1, is_system: 0, is_dynamic_budget: 1, budgetRules: [] };

const AddItemPage = ({ budgetId = null, isEdit = true }) => {
  const methods = useForm({ defaultValues: formDefaultValue });

  const onSubmit = async (values) => {
    let formData = { ...values };
    try {
      if (budgetId) {
        await update(budgetId, formData);
        showToast.success('Cập nhật thành công !');
      } else {
        await create(formData);
        showToast.success('Thêm thành công !');
        methods.reset({});
      }
    } catch (error) {
      showToast.error(error.message ?? 'Cõ lỗi xảy ra!');
    }
  };

  const loadItemDetail = useCallback(async () => {
    if (budgetId) {
      const detail = await getDetail(budgetId);
      methods.reset({
        ...detail,
      });
    }
  }, [budgetId, methods]);

  useEffect(() => {
    loadItemDetail();
  }, [loadItemDetail]);

  const detailForm = [
    {
      id: 'information',
      title: 'Thông tin Ngân Sách',
      component: BudgetInfo,
      fieldActive: ['budget_type_id', 'budget_code', 'short_name', 'budget_name'],
    },
    { id: 'status', title: 'Trạng thái', component: BudgetStatus },
  ];

  return (
    <FormProvider {...methods}>
      <FormSection detailForm={detailForm} onSubmit={onSubmit} disabled={!isEdit} />
    </FormProvider>
  );
};

export default AddItemPage;
